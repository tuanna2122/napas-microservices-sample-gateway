import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Deposit } from './deposit.model';
import { DepositPopupService } from './deposit-popup.service';
import { DepositService } from './deposit.service';

@Component({
    selector: 'jhi-deposit-delete-dialog',
    templateUrl: './deposit-delete-dialog.component.html'
})
export class DepositDeleteDialogComponent {

    deposit: Deposit;

    constructor(
        private depositService: DepositService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.depositService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'depositListModification',
                content: 'Deleted an deposit'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-deposit-delete-popup',
    template: ''
})
export class DepositDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private depositPopupService: DepositPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.depositPopupService
                .open(DepositDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
