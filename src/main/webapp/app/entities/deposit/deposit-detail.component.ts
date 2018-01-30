import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Deposit } from './deposit.model';
import { DepositService } from './deposit.service';

@Component({
    selector: 'jhi-deposit-detail',
    templateUrl: './deposit-detail.component.html'
})
export class DepositDetailComponent implements OnInit, OnDestroy {

    deposit: Deposit;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private depositService: DepositService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDeposits();
    }

    load(id) {
        this.depositService.find(id).subscribe((deposit) => {
            this.deposit = deposit;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDeposits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'depositListModification',
            (response) => this.load(this.deposit.id)
        );
    }
}
