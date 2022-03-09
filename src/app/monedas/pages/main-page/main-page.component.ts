import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MonedasService } from '../../services/monedas.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  model!: NgbDateStruct;
  mySubjectFlag: Subject<boolean> = new Subject<boolean>();
  @ViewChild('inputDate') inputDate!: ElementRef;
  formMonedas: FormGroup = this.fb.group({
    date: [, [Validators.required]],
    symbols: [, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    amount: [, [Validators.required, Validators.min(1)]]
  });
  result!: number | boolean | undefined;
  year!: number;
  month!: number;
  day!: number;
  conversionOptions: string[] = [];

  constructor(private fb: FormBuilder, private monedasService: MonedasService) { }

  ngOnInit(): void {
    const [year, month, day] = new Date().toLocaleDateString().split('/').reverse().map(value => +value);
    this.year = year;
    this.month = month
    this.day = day;

    // Se coloca la fecha  actual por defecto
    this.formMonedas.patchValue({ date: { year, month, day } });

    this.onChanges();

    this.monedasService.currencyRates().subscribe(response => {
      if (response.success === false) {
        Swal.fire('Error', response.error?.info);
        return;
      }
      this.conversionOptions = response;
    });
  }

  /**
   * Método que se encarga de validar cada vez que un valor del formulario cambia
   */
  onChanges(): void {
    this.formMonedas.valueChanges
      .pipe(
        takeUntil(this.mySubjectFlag)
      ).subscribe(() => {
        this.result = undefined;

        if (this.formMonedas.invalid) {
          this.formMonedas.markAllAsTouched();
          console.log('Formulario no es valido');
          return;
        }

        this.monedasService.convertCurrency(this.formMonedas.value).subscribe(response => {
          if (response.success === false) {
            Swal.fire('Error', response.error?.info);
            return;
          }
          this.result = response;
        });

      });
  }

  /**
   * Método para validar si un control del formulario tiene el error min
   * @param control - Control a validar
   * @returns true si tiene el error y ha sido tocado de lo contrario false
   */
  checkControlMinError(control:string){
    return this.formMonedas.get(control)?.hasError('min') && this.formMonedas.get(control)?.touched;
  }

  /**
   * Método para validar si un control del formulario tiene el error required
   * @param control - Control a validar
   * @returns true si tiene el error y ha sido tocado de lo contrario false
   */
  checkControlRequiredError(control:string){
    return this.formMonedas.get(control)?.hasError('required') && this.formMonedas.get(control)?.touched;
  }

  ngOnDestroy(): void {
    this.mySubjectFlag.next(true);
    this.mySubjectFlag.complete();
    console.log('destroyed');
    // Se utiliza complete para finalizar las subscripciones hijas, si se utiliza unsubscribe
    // Es como si yo hiciera this.mySubjectFlag.subscribe, y me desubscribo, lo cual nunca pasa
    // Nunca me estoy suscribiendo a this.mySubjectFlag, por eso debo usar complete
  }

}
