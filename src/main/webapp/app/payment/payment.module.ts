import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../shared';

import { PAYMENT_ROUTE, PaymentComponent, NapasGatewayService } from './';

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forChild([ PAYMENT_ROUTE ])
    ],
    declarations: [
        PaymentComponent,
    ],
    entryComponents: [
    ],
    providers: [
      NapasGatewayService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayPaymentModule {}
