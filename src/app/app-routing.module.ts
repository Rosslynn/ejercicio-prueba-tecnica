import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'monedas',
    loadChildren:()=> import('./monedas/monedas.module').then(m => m.MonedasModule)
  },
  {
    path:'**',
    redirectTo:'monedas'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
