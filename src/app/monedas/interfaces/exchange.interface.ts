export interface IExchangeResponse {
    success:    boolean;
    timestamp:  number;
    historical: boolean;
    base:       string;
    date:       Date;
    rates:      any;
}

