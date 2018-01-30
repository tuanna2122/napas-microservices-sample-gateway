export class NapasGateway {
  constructor(
    public vpcUrl: string,
    public merchantId: string,
    public accessCode: string,
    public secureHash: string,
    public username: string,
    public password: string
  ) {}
}
