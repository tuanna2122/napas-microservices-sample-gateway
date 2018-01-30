/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { GatewayTestModule } from '../../../test.module';
import { DepositDialogComponent } from '../../../../../../main/webapp/app/entities/deposit/deposit-dialog.component';
import { DepositService } from '../../../../../../main/webapp/app/entities/deposit/deposit.service';
import { Deposit } from '../../../../../../main/webapp/app/entities/deposit/deposit.model';

describe('Component Tests', () => {

    describe('Deposit Management Dialog Component', () => {
        let comp: DepositDialogComponent;
        let fixture: ComponentFixture<DepositDialogComponent>;
        let service: DepositService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [DepositDialogComponent],
                providers: [
                    DepositService
                ]
            })
            .overrideTemplate(DepositDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DepositDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DepositService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Deposit(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.deposit = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'depositListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Deposit();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.deposit = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'depositListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
