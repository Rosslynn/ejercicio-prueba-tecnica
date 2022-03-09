export interface IRatesResponse {
    success:   boolean;
    timestamp: number;
    base:      string;
    date:      Date;
    rates:     { [key: string]: number };
}
