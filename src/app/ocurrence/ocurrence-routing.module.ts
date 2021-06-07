import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OcurrencePage } from './ocurrence.page';

const routes: Routes = [
  {
    path: '',
    component: OcurrencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OcurrencePageRoutingModule {}
