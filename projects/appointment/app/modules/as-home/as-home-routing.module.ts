import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsHomeNewComponent } from './components/as-home-new/as-home-new.component';

const routes: Routes = [
  {
    path: '',
    component: AsHomeNewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  entryComponents: []
})
export class AsHomeRoutingModule { }
