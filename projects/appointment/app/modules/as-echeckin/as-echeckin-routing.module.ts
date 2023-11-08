import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestEcheckinGuard } from 'shared/guards/guest-echeckin-guard';
import { AsEcheckinComponent } from './as-echeckin.component';
import { AsEcheckinConfirmationComponent } from './components/as-echeckin-confirmation/as-echeckin-confirmation.component';
// tslint:disable-next-line: max-line-length
import { AsEcheckinInsuranceInformationComponent } from './components/as-echeckin-insurance-information/as-echeckin-insurance-information.component';
import { AsEcheckinOrderExpiryComponent } from './components/as-echeckin-order-expiry/as-echeckin-order-expiry.component';
// tslint:disable-next-line: max-line-length
import { AsEcheckinPersonalInformationComponent } from './components/as-echeckin-personal-information/as-echeckin-personal-information.component';
import { AsEcheckinTokenNotFoundComponent } from './components/as-echeckin-token-not-found/as-echeckin-token-not-found.component';
const routes: Routes = [
    {
        path: '',
        component: AsEcheckinComponent,
        canActivate: [],
        children: [
            {
                path: 'as-echeckin-personal-information',
                component: AsEcheckinPersonalInformationComponent,
                data: { title: 'Echeckin - Personal Information' },
                canActivate: [GuestEcheckinGuard]
            }, {
                path: 'as-echeckin-insurance-information',
                component: AsEcheckinInsuranceInformationComponent,
                data: { title: 'Echeckin - Insurance Information' },
                canActivate: [GuestEcheckinGuard]
            }, {
                path: 'as-echeckin-confirmation',
                component: AsEcheckinConfirmationComponent,
                data: { title: 'Echeckin - Confirmation' },
                canActivate: [GuestEcheckinGuard]
            }, {
              path: 'as-echeckin-order-expiry',
              component: AsEcheckinOrderExpiryComponent,
              data: { title: 'Echeckin - order expiry' },
              canActivate: []
            },
            {
                path: 'as-echeckin-token-not-found',
                component: AsEcheckinTokenNotFoundComponent,
                data: { title: 'Echeckin - token not found' },
                canActivate: []
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AsEcheckinRoutingModule { }
