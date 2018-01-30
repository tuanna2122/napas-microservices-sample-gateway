import { BaseEntity } from './../../shared';

export class Deposit implements BaseEntity {
    constructor(
        public id?: number,
        public bookingCode?: string,
        public userId?: number,
        public currencyCode?: string,
    ) {
    }
}
