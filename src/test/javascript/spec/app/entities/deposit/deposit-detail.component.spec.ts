/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { GatewayTestModule } from '../../../test.module';
import { DepositDetailComponent } from '../../../../../../main/webapp/app/entities/deposit/deposit-detail.component';
import { DepositService } from '../../../../../../main/webapp/app/entities/deposit/deposit.service';
import { Deposit } from '../../../../../../main/webapp/app/entities/deposit/deposit.model';

describe('Component Tests', () => {

    describe('Deposit Management Detail Component', () => {
        let comp: DepositDetailComponent;
        let fixture: ComponentFixture<DepositDetailComponent>;
        let service: DepositService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [DepositDetailComponent],
                providers: [
                    DepositService
                ]
            })
            .overrideTemplate(DepositDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DepositDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DepositService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Deposit(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.deposit).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
