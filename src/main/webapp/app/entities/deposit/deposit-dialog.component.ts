import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Deposit } from './deposit.model';
import { DepositPopupService } from './deposit-popup.service';
import { DepositService } from './deposit.service';

@Component({
    selector: 'jhi-deposit-dialog',
    templateUrl: './deposit-dialog.component.html'
})
export class DepositDialogComponent implements OnInit {

    deposit: Deposit;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private depositService: DepositService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.deposit.id !== undefined) {
            this.subscribeToSaveResponse(
                this.depositService.update(this.deposit));
        } else {
            this.subscribeToSaveResponse(
                this.depositService.create(this.deposit));
        }
    }

    private subscribeToSaveResponse(result: Observable<Deposit>) {
        result.subscribe((res: Deposit) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Deposit) {
        this.eventManager.broadcast({ name: 'depositListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-deposit-popup',
    template: ''
})
export class DepositPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private depositPopupService: DepositPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.depositPopupService
                    .open(DepositDialogComponent as Component, params['id']);
            } else {
                this.depositPopupService
                    .open(DepositDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
