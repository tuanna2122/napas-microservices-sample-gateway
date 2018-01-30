import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../app.constants';

import { NapasGateway } from './napas.gateway.model';

@Injectable()
export class NapasGatewayService {
    constructor(private http: Http) { }

    getGatewayInfo(): Observable<NapasGateway> {
        return this.http.get(SERVER_API_URL + '/paymentservice/api/gateway-properties').map((res: Response) => res.json());
    }

    makePayment(napasGateway: NapasGateway): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/test-make-payment', napasGateway);
    }
}
