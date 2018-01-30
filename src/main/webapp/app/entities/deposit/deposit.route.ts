import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DepositComponent } from './deposit.component';
import { DepositDetailComponent } from './deposit-detail.component';
import { DepositPopupComponent } from './deposit-dialog.component';
import { DepositDeletePopupComponent } from './deposit-delete-dialog.component';

export const depositRoute: Routes = [
    {
        path: 'deposit',
        component: DepositComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gatewayApp.deposit.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'deposit/:id',
        component: DepositDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gatewayApp.deposit.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const depositPopupRoute: Routes = [
    {
        path: 'deposit-new',
        component: DepositPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gatewayApp.deposit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'deposit/:id/edit',
        component: DepositPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gatewayApp.deposit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'deposit/:id/delete',
        component: DepositDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gatewayApp.deposit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
