/**
 * 
 */
package com.booking.gateway.service.dto;

/**
 * @author tuannguyena6
 *
 */
public class NapasGatewayDTO {

	private String vpcUrl;
	private String merchantId;
	private String accessCode;
	private String secureHash;
	private String username;
	private String password;

	public String getVpcUrl() {
		return vpcUrl;
	}

	public String getMerchantId() {
		return merchantId;
	}

	public String getAccessCode() {
		return accessCode;
	}

	public String getSecureHash() {
		return secureHash;
	}

	public String getUsername() {
		return username;
	}

	public String getPassword() {
		return password;
	}

	public void setVpcUrl(String vpcUrl) {
		this.vpcUrl = vpcUrl;
	}

	public void setMerchantId(String merchantId) {
		this.merchantId = merchantId;
	}

	public void setAccessCode(String accessCode) {
		this.accessCode = accessCode;
	}

	public void setSecureHash(String secureHash) {
		this.secureHash = secureHash;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("NapasGatewayDTO [vpcUrl=");
		builder.append(vpcUrl);
		builder.append(", merchantId=");
		builder.append(merchantId);
		builder.append(", accessCode=");
		builder.append(accessCode);
		builder.append(", secureHash=");
		builder.append(secureHash);
		builder.append(", username=");
		builder.append(username);
		builder.append(", password=");
		builder.append(password);
		builder.append(", getVpcUrl()=");
		builder.append(getVpcUrl());
		builder.append(", getMerchantId()=");
		builder.append(getMerchantId());
		builder.append(", getAccessCode()=");
		builder.append(getAccessCode());
		builder.append(", getSecureHash()=");
		builder.append(getSecureHash());
		builder.append(", getUsername()=");
		builder.append(getUsername());
		builder.append(", getPassword()=");
		builder.append(getPassword());
		builder.append("]");
		return builder.toString();
	}
	
}
