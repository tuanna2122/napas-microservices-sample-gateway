/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { GatewayTestModule } from '../../../test.module';
import { DepositComponent } from '../../../../../../main/webapp/app/entities/deposit/deposit.component';
import { DepositService } from '../../../../../../main/webapp/app/entities/deposit/deposit.service';
import { Deposit } from '../../../../../../main/webapp/app/entities/deposit/deposit.model';

describe('Component Tests', () => {

    describe('Deposit Management Component', () => {
        let comp: DepositComponent;
        let fixture: ComponentFixture<DepositComponent>;
        let service: DepositService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [DepositComponent],
                providers: [
                    DepositService
                ]
            })
            .overrideTemplate(DepositComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DepositComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DepositService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Deposit(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.deposits[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
