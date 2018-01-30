import { Route } from '@angular/router';

import { PaymentComponent } from './';

export const PAYMENT_ROUTE: Route = {
    path: 'payment',
    component: PaymentComponent,
    data: {
        authorities: [],
        pageTitle: 'payment.title'
    }
};
