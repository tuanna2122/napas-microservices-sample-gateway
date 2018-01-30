import {Component, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';
import {ActivatedRoute} from '@angular/router';

import {Account, LoginModalService, Principal} from '../shared';
import {NapasGateway} from './napas.gateway.model';
import {NapasGatewayService} from './napas.gateway.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './payment.component.html',
  styleUrls: [
    'payment.css'
  ]

})
export class PaymentComponent implements OnInit {

  napasGateway: NapasGateway;
  napasRedirectUrl: String = '';

  constructor(private napasGatewayService: NapasGatewayService, private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
        console.log('vpc_ResponseCode = ' + params['vpc_ResponseCode']);
        console.log('vpc_TransactionNo = ' + params['vpc_TransactionNo']);
    });
  }

  ngOnInit() {
    this.napasGatewayService.getGatewayInfo().subscribe((napasGateway) => {
      this.napasGateway = napasGateway;
    });
  }

  registerAuthenticationSuccess() {
  }

  isAuthenticated() {
  }

  login() {
  }

  makePayment() {
    this.napasGatewayService.makePayment(this.napasGateway).subscribe((res) => this.redirect(res._body));
  }

  redirect(url: string) {
    window.location.href = '' + url;
  }
}
