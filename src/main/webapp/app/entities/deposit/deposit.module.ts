import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';
import {
    DepositService,
    DepositPopupService,
    DepositComponent,
    DepositDetailComponent,
    DepositDialogComponent,
    DepositPopupComponent,
    DepositDeletePopupComponent,
    DepositDeleteDialogComponent,
    depositRoute,
    depositPopupRoute,
} from './';

const ENTITY_STATES = [
    ...depositRoute,
    ...depositPopupRoute,
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DepositComponent,
        DepositDetailComponent,
        DepositDialogComponent,
        DepositDeleteDialogComponent,
        DepositPopupComponent,
        DepositDeletePopupComponent,
    ],
    entryComponents: [
        DepositComponent,
        DepositDialogComponent,
        DepositPopupComponent,
        DepositDeleteDialogComponent,
        DepositDeletePopupComponent,
    ],
    providers: [
        DepositService,
        DepositPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayDepositModule {}
