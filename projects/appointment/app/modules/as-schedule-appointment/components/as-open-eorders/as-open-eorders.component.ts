import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { OpenEorders } from 'shared/models';
import { editSummaryDetails } from 'shared/models/eOrder-state-navigation';
import { AuthInsuranceService } from 'shared/services/auth-ins/auth-insurance.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { OpenEordersStateNavigation } from './../../../../../../shared/src/lib/models/eOrder-state-navigation';

@Component({
  selector: 'as-open-eorders',
  templateUrl: './as-open-eorders.component.html',
  styleUrls: ['./as-open-eorders.component.scss']
})
export class AsOpenEordersComponent implements OnInit, OnDestroy {

  content = homeContent;
  items$: Observable<OpenEorders[]>;
  selectedItem: OpenEorders;
  loading$ = new Subject<boolean>();
  loadingIcon = false;
  Subscription: Subscription;

  constructor(
    private eOderStateNavigationService: EorderStateNavigationService,
    private router: Router,
    private eorderService: EorderService,
    private eOrderDataService: EorderDataService,
    private authInsuranceService: AuthInsuranceService
  ) {
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  ngOnInit() {
    this.eOrderDataService.isEorderFlowActivated(false);
    this.fetchEorders();
    this.setActiveElementAfterPageLoad();
    this.getSelectedOrder();
  }

  setActiveElementAfterPageLoad() {
    setTimeout(() => {
      if (document.getElementById('back-button-open-orders')) {
        document.getElementById('back-button-open-orders').focus();
      }
    }, 100);
  }

  fetchEorders() {
    this.items$ = this.eOderStateNavigationService.getEorders();
  }

  selectedEorder(eorder: OpenEorders) {
    this.selectedItem = eorder;
    this.setSelectedEorder(eorder);
  }

  continueEorderFlow() {
    if (this.selectedItem && this.selectedItem.token !== '-1') {
      this.loadingIcon = true;
      this.eorderService.getEncounterInfo(this.selectedItem.token).pipe(
        map((tokenInfo) => {
          if (tokenInfo.status) {
            return null;
          } else {
            return tokenInfo;
          }
        }),
        mergeMap((tokenData) => {
          if (!tokenData) {
            const req: OpenEordersStateNavigation = {
              navigateToPage: '/as-home'
            };
            return of(req);
          }
          return this.eOderStateNavigationService.createEorderUserSession(this.selectedItem.token);
        }),
        catchError(() => {
          this.loadingIcon = false;
          return null;
        })
      ).subscribe((data: OpenEordersStateNavigation) => {
        this.loadingIcon = false;
        this.authInsuranceService.setOpenEorder(true);
        if (data.navigateToPage) {
          this.router.navigate([data.navigateToPage]);
        } else {
          if (data && data.stateNavigation) {
            this.eOderStateNavigationService.getRoutePathByFlow(data.stateNavigation, data.confirmationCode, true);
          } else {
            this.eOderStateNavigationService.getRoutePathByFlow(editSummaryDetails.whoIsVisiting, null, true);
          }
        }
      }, () => {
        this.loadingIcon = false;
      });
    } else {
      this.eOderStateNavigationService.blnSkippedOpenEorder = true;
      this.router.navigate(['/schedule-appointment/as-reason-for-visit']);
    }
  }

  goToPrevious() {
    this.router.navigate(['/as-home']);
    this.setSelectedEorder(null);
  }


  getSelectedOrder() {
    this.Subscription = this.eOderStateNavigationService.getSelectedEorder().subscribe((eorder: OpenEorders) => {
      this.selectedItem = eorder;
    });
  }

  setSelectedEorder(item: OpenEorders) {
    this.eOderStateNavigationService.setSelectedEorder(item);
  }

}
