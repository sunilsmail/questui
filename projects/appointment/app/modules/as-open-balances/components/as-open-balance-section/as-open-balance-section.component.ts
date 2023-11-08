
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OpenBalanceService } from 'shared/services/open-balance/open-balance.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { OpenBalanceApiResponse, OBEnum, OBUiBindControls, SearchARResponse } from './../../../../../../shared/src/lib/models/open-balance';


@Component({
  selector: 'as-open-balance-section',
  templateUrl: './as-open-balance-section.component.html',
  styleUrls: ['./as-open-balance-section.component.scss']
})
export class AsOpenBalanceSectionComponent implements OnInit {
  content = homeContent;
  openBalanceApiResponse$: Observable<OBUiBindControls>;
  title = null;
  description = null;
  openBalancePaymentType = new FormControl();
  constructor(
    private openBalanceService: OpenBalanceService,
    private router: Router
    ) { }

  ngOnInit() {
    this.openBalanceApiResponse$ = this.openBalanceService.getOBResponse()
      .pipe(
        map((apiRes: OpenBalanceApiResponse) => {
          return this.transform(apiRes);
        })
      );
  }

  updateTemplate(rsp: OBUiBindControls) {
    this.title = this.content?.as_open_balance_section?.warning_title;
    if (rsp.minimumPayment) {
      this.description = this.content?.as_open_balance_section?.warning_minidue_desc;
    } else if (rsp.pastDueBalance) {
      this.description = this.content?.as_open_balance_section?.warning_pastdue_desc;
    } else if (rsp.totalBalance) {
      this.description = this.content?.as_open_balance_section?.warning_totaldue_desc;
    }
  }

  transform(rsp: OpenBalanceApiResponse): OBUiBindControls {
    if (rsp) {
      const controlsdata: OBUiBindControls = {
        minimumPayment: +rsp?.searchARResponse?.totalMinDue,
        pastDueBalance: +rsp?.searchARResponse?.totalPendingPaymentAmount,
        totalBalance: +rsp?.searchARResponse?.totalOverDue,
        titleBalance: this.getTitleBalance(rsp.searchARResponse)
      };
      this.updateTemplate(controlsdata);
      return controlsdata;
    }
    return null;
  }

  getTitleBalance(rsp: SearchARResponse): number {
    if (rsp?.totalMinDue) {
      return +rsp?.totalMinDue;
    } else if (rsp?.totalOverDue) {
      return +rsp?.totalOverDue;
    }
    return null;
  }

  handleChange(event) {
    if (event === OBEnum.minimumPayment) {

    } else if (event === OBEnum.pastDueBalance) {

    } else if (event === OBEnum.totalBalance) {

    }
  }

  payAtAppointment() {
    this.router.navigate(['/eorder/as-open-balance/as-pay-at-appointment']);
  }

}
