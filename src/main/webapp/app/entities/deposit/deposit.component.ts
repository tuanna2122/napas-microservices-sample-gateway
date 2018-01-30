import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Deposit } from './deposit.model';
import { DepositService } from './deposit.service';
import { Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-deposit',
    templateUrl: './deposit.component.html'
})
export class DepositComponent implements OnInit, OnDestroy {
deposits: Deposit[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private depositService: DepositService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.depositService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.deposits = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.depositService.query().subscribe(
            (res: ResponseWrapper) => {
                this.deposits = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDeposits();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Deposit) {
        return item.id;
    }
    registerChangeInDeposits() {
        this.eventSubscriber = this.eventManager.subscribe('depositListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
