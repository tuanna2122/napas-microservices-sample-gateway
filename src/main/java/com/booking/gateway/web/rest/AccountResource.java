package com.booking.gateway.web.rest;

import java.net.URLEncoder;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.booking.gateway.domain.User;
import com.booking.gateway.repository.UserRepository;
import com.booking.gateway.security.SecurityUtils;
import com.booking.gateway.service.MailService;
import com.booking.gateway.service.UserService;
import com.booking.gateway.service.dto.NapasGatewayDTO;
import com.booking.gateway.service.dto.UserDTO;
import com.booking.gateway.web.rest.errors.EmailAlreadyUsedException;
import com.booking.gateway.web.rest.errors.EmailNotFoundException;
import com.booking.gateway.web.rest.errors.InternalServerErrorException;
import com.booking.gateway.web.rest.errors.InvalidPasswordException;
import com.booking.gateway.web.rest.errors.LoginAlreadyUsedException;
import com.booking.gateway.web.rest.vm.KeyAndPasswordVM;
import com.booking.gateway.web.rest.vm.ManagedUserVM;
import com.codahale.metrics.annotation.Timed;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;

    private final UserService userService;

    private final MailService mailService;

	private static final char[] HEX_TABLE = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
			'C', 'D', 'E', 'F' };

    public AccountResource(UserRepository userRepository, UserService userService, MailService mailService) {

        this.userRepository = userRepository;
        this.userService = userService;
        this.mailService = mailService;
    }

    /**
     * POST  /register : register the user.
     *
     * @param managedUserVM the managed user View Model
     * @throws InvalidPasswordException 400 (Bad Request) if the password is incorrect
     * @throws EmailAlreadyUsedException 400 (Bad Request) if the email is already used
     * @throws LoginAlreadyUsedException 400 (Bad Request) if the login is already used
     */
    @PostMapping("/register")
    @Timed
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        if (!checkPasswordLength(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        userRepository.findOneByLogin(managedUserVM.getLogin().toLowerCase()).ifPresent(u -> {throw new LoginAlreadyUsedException();});
        userRepository.findOneByEmailIgnoreCase(managedUserVM.getEmail()).ifPresent(u -> {throw new EmailAlreadyUsedException();});
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
        mailService.sendActivationEmail(user);
    }

    /**
     * GET  /activate : activate the registered user.
     *
     * @param key the activation key
     * @throws RuntimeException 500 (Internal Server Error) if the user couldn't be activated
     */
    @GetMapping("/activate")
    @Timed
    public void activateAccount(@RequestParam(value = "key") String key) {
        Optional<User> user = userService.activateRegistration(key);
        if (!user.isPresent()) {
            throw new InternalServerErrorException("No user was found for this reset key");
        }
    }

    /**
     * GET  /authenticate : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request
     * @return the login if the user is authenticated
     */
    @GetMapping("/authenticate")
    @Timed
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * GET  /account : get the current user.
     *
     * @return the current user
     * @throws RuntimeException 500 (Internal Server Error) if the user couldn't be returned
     */
    @GetMapping("/account")
    @Timed
    public UserDTO getAccount() {
        return userService.getUserWithAuthorities()
            .map(UserDTO::new)
            .orElseThrow(() -> new InternalServerErrorException("User could not be found"));
    }

    /**
     * POST  /account : update the current user information.
     *
     * @param userDTO the current user information
     * @throws EmailAlreadyUsedException 400 (Bad Request) if the email is already used
     * @throws RuntimeException 500 (Internal Server Error) if the user login wasn't found
     */
    @PostMapping("/account")
    @Timed
    public void saveAccount(@Valid @RequestBody UserDTO userDTO) {
        final String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new InternalServerErrorException("Current user login not found"));
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getLogin().equalsIgnoreCase(userLogin))) {
            throw new EmailAlreadyUsedException();
        }
        Optional<User> user = userRepository.findOneByLogin(userLogin);
        if (!user.isPresent()) {
            throw new InternalServerErrorException("User could not be found");
        }
        userService.updateUser(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(),
            userDTO.getLangKey(), userDTO.getImageUrl());
   }

    /**
     * POST  /account/change-password : changes the current user's password
     *
     * @param password the new password
     * @throws InvalidPasswordException 400 (Bad Request) if the new password is incorrect
     */
    @PostMapping(path = "/account/change-password")
    @Timed
    public void changePassword(@RequestBody String password) {
        if (!checkPasswordLength(password)) {
            throw new InvalidPasswordException();
        }
        userService.changePassword(password);
   }

    /**
     * POST   /account/reset-password/init : Send an email to reset the password of the user
     *
     * @param mail the mail of the user
     * @throws EmailNotFoundException 400 (Bad Request) if the email address is not registered
     */
    @PostMapping(path = "/account/reset-password/init")
    @Timed
    public void requestPasswordReset(@RequestBody String mail) {
       mailService.sendPasswordResetMail(
           userService.requestPasswordReset(mail)
               .orElseThrow(EmailNotFoundException::new)
       );
    }

    /**
     * POST   /account/reset-password/finish : Finish to reset the password of the user
     *
     * @param keyAndPassword the generated key and the new password
     * @throws InvalidPasswordException 400 (Bad Request) if the password is incorrect
     * @throws RuntimeException 500 (Internal Server Error) if the password could not be reset
     */
    @PostMapping(path = "/account/reset-password/finish")
    @Timed
    public void finishPasswordReset(@RequestBody KeyAndPasswordVM keyAndPassword) {
        if (!checkPasswordLength(keyAndPassword.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        Optional<User> user =
            userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey());

        if (!user.isPresent()) {
            throw new InternalServerErrorException("No user was found for this reset key");
        }
    }

	@PostMapping("/test-make-payment")
	public String testMakePayment(@RequestBody NapasGatewayDTO napasGateway) throws Exception {
		log.debug(napasGateway.toString());

		Map<String, Object> params = new HashMap<>();
		params.put("vpc_Version", "2.0");
		params.put("vpc_Command", "pay");
		params.put("vpc_AccessCode", napasGateway.getAccessCode());

		Date today = new Date();
		String merchantTxnRef = "TEST_" + String.valueOf(today.getTime()).substring(5);
		String merchantOrderInfo = String.valueOf(today.getTime() + 82009);

		params.put("vpc_MerchTxnRef", merchantTxnRef);
		params.put("vpc_Merchant", napasGateway.getMerchantId());
		params.put("vpc_OrderInfo", merchantOrderInfo);
		params.put("vpc_Amount", "1000000");
		params.put("vpc_ReturnURL", "http://localhost:9000/#/payment");
		params.put("vpc_BackURL", "http://localhost:9000/#/payment");
		params.put("vpc_Locale", "vn");
		params.put("vpc_Currency", "VND");
		params.put("vpc_TicketNo", "192.168.66.99");

		StringBuilder sb = new StringBuilder();
		sb.append(napasGateway.getVpcUrl());
		sb.append("?");

		if (napasGateway.getSecureHash() != null && napasGateway.getSecureHash().length() > 0) {
			String secureHash = hashAllFields(params, napasGateway.getSecureHash());
			params.put("vpc_SecureHash", secureHash);
		}

		// create a list
		List<String> paramNames = new ArrayList<>(params.keySet());
		Iterator<String> itr = paramNames.iterator();

		// move through the list and create a series of URL key/value pairs
		while (itr.hasNext()) {
			String paramName = itr.next();
			String paramValue = (String) params.get(paramName);

			if ((paramValue != null) && (paramValue.length() > 0)) {
				// append the URL parameters
				sb.append(URLEncoder.encode(paramName, "UTF-8"));
				sb.append('=');
				sb.append(URLEncoder.encode(paramValue, "UTF-8"));
			}

			// add a '&' to the end if we have more fields coming.
			if (itr.hasNext()) {
				sb.append('&');
			}
		}

		return sb.toString();
	}

    private static boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH &&
            password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
    }

	private String hex(byte[] bytes) {
		// create a StringBuilder 2x the size of the hash array
		StringBuilder sb = new StringBuilder(bytes.length * 2);

		// retrieve the byte array data, convert it to hex and add it to the StringBuilder
		for (int i = 0; i < bytes.length; i++) {
			sb.append(HEX_TABLE[(bytes[i] >> 4) & 0xf]);
			sb.append(HEX_TABLE[bytes[i] & 0xf]);
		}

		return sb.toString();
	}

	private String hashAllFields(Map<String, Object> params, String secureSecret) {

		// create a list and sort it
		List<String> fieldNames = new ArrayList<>(params.keySet());
		Collections.sort(fieldNames);

		// create a builder for the md5 input and add the secure secret first
		StringBuilder sb = new StringBuilder();
		sb.append(secureSecret);

		// iterate through the list and add the remaining field values
		Iterator<String> itr = fieldNames.iterator();

		while (itr.hasNext()) {
			String paramName = itr.next();
			String paramValue = (String) params.get(paramName);
			if ((paramValue != null) && (paramValue.length() > 0)) {
				sb.append(paramValue);
			}
		}

		MessageDigest md5 = null;
		byte[] bytes = null;
		log.debug("input: " + sb.toString());

		// create the md5 hash and UTF-8 encode it
		try {
			md5 = MessageDigest.getInstance("MD5");
			bytes = md5.digest(sb.toString().getBytes("UTF-8"));
		} catch (Exception e) {
		} // wont happen

		return hex(bytes);

	}
}
