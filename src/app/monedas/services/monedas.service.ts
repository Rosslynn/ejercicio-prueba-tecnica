import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { IExchangeResponse } from '../interfaces/exchange.interface';
import { IRatesResponse } from '../interfaces/rates.interface';

interface iFormCurrency {
  date: iBootstrapDate;
  symbols: string;
  amount: number;
}

interface iBootstrapDate {
  day: number;
  month: number;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class MonedasService {

  private baseUrl: string = environment.baseUrl;
  private base: string = 'EUR';
  private separator: string = '-';

  constructor(private http: HttpClient) { }

  /**
   * Método para convertir de Euros a la moneda indicada en la fecha indicada
   * @param formData - Información del formulario reactivo
   * @returns - Valor de la conversión o error
   */
  convertCurrency(formData: iFormCurrency): Observable<IExchangeResponse | any> {
    // Se convierte los symbolos a mayúsculas para posibles evitar problemas
    formData.symbols = formData.symbols.toUpperCase();

    // Se formatea la fecha que da por defecto el time picker de boostrap
    const dayString: string = formData.date.day < 10 ? `0${formData.date.day}` : `${formData.date.day}`;
    const monthString: string = formData.date.month < 10 ? `0${formData.date.month}` : `${formData.date.month}`;
    const dateString = `${formData.date.year}${this.separator}${monthString}${this.separator}${dayString}`;

    // Se forman las querys que se enviarán
    const params = new HttpParams().set('base', this.base).set('symbols', formData.symbols).set('access_key', environment.access_key);
    const url = `${this.baseUrl}/${dateString}`;

    // Se retorna el observable
    return this.http.get<IExchangeResponse>(url, { params })
      .pipe(
        map((reponse) => {
          if (!reponse.success) {
            return reponse;
          }
          return reponse.rates[formData.symbols] * formData.amount;
        }),
        catchError(error => of(error))
      );
  }

  /**
   * Método para obtener los rates de las monedas
   * @returns - Identificadores de los conversores disponibles o error
   */
  currencyRates(){
    const url = `${this.baseUrl}/v1/latest`;
    const params = new HttpParams().set('access_key', environment.access_key);
    return this.http.get<IRatesResponse>(url, { params })
    .pipe(
      map(response => {
        if (!response.success) {
          return response;
        }
        return Object.keys(response.rates);
      }),
      catchError(error => of(error))
    );
  }
}
