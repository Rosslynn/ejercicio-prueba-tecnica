import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MonedasRoutingModule } from './monedas-routing.module';
import { MainPageComponent } from './pages/main-page/main-page.component';


@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    MonedasRoutingModule,
  ],
})
export class MonedasModule { }
