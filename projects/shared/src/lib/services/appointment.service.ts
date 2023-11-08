import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateAppointmentData, ModifyAppointment } from 'shared/models/create-appointment-data';
import { ReasonCategory } from 'shared/models/reason-category';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { FindAppointmentService } from './find-appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  serverUrl = '/guest';
  mockReasonsUrl = 'assets/reasons.json';
  mockTestsUrl = 'assets/employertests.json';
  private _selectedTests: any[] = [];
  distance = null;
  public get selectedTests(): any[] {
    return this._selectedTests;
  }
  public set selectedTests(value: any[]) {
    this._selectedTests = value;
  }
  constructor(private api: ApiService,
    private findAppointmentService: FindAppointmentService,
    private dataService: DataService) { }

  getReasons(category: string, selectedCategory?: ReasonCategory, deepLinkFlow = false): Observable<ReasonCategory[]> {
    return this.getReasonsWithCategory(category, selectedCategory, deepLinkFlow);
  }

  getReasonsWithCategory(category: string, selectedCategory?: ReasonCategory, deepLinkFlow?: boolean): Observable<ReasonCategory[]> {
    return this.api.get<ReasonCategory[]>(this.serverUrl + '/getReasons/' + category).pipe(
      map((prog: ReasonCategory[]) => {
        return prog.map((progData) => {
          return (<ReasonCategory>{
            facilityServiceId: progData.facilityServiceId,
            facilityTestType: progData.facilityTestType,
            facilityTestTypeValue: progData.facilityTestTypeValue,
            testDesc: progData.testDesc,
            precedence: progData.precedence,
            serviceRequestor: progData.serviceRequestor,
            index: progData.index,
            activeInd: progData.activeInd,
            //  mapping parent purchasetest skipinsurnace vlaue to child
            skipInsurance: this.getSkipInsurance(category, selectedCategory, progData),
            visitCategory: this.getVisitCategory(category),
            deeplinkReason: progData.deeplinkReason
          });
        }).filter(deepLinkFlow ? res => res : item => item.activeInd === true)
          .filter(item => {
            if (this.findAppointmentService.filterCovidTest && this.findAppointmentService.covidIds.length > 0) {
              item.supressDialog = false;
              return this.findAppointmentService.covidIds.includes(item.facilityServiceId);
            } else {
              return item;
            }
          });
      })
    );
  }

  getSkipInsurance(category: String, selectedCategory?: ReasonCategory, progData?: ReasonCategory): boolean {
    if (category === 'PURCHASETEST') {
      return selectedCategory ? selectedCategory.skipInsurance : false;
    }
    return progData ? progData.skipInsurance : false;
  }
  createAppointment(body: CreateAppointmentData, isAuthenticated: boolean) {
    if (isAuthenticated) {
      return this.api.post('/api/createAppointment', body);
    } else {
      return this.api.post('/guest/createAppointment/', body);
    }
  }

  modifyAppointment(body: ModifyAppointment) {
    const kitCollectionIds = [32, 34];
    this.findAppointmentService.appointmentDetails = null;
    if (body && body.slot && body.slot.facilityServiceId.length > 1) {
      if (body.slot.facilityServiceId.every(facilityId => kitCollectionIds.includes(facilityId))) {
        body.slot.facilityServiceId = [body.slot.facilityServiceId[0]];
      }
    }
    if (this.dataService.searchCovidAppointmentsBy) {
      if (body && body.slot && body.slot.facilityServiceId) {
        body.slot.facilityServiceId = [this.dataService.searchCovidAppointmentsBy];
      }
    }
    return this.api.post(this.serverUrl + '/modifyAppointment/', body);
  }
  getVisitCategory(category: string): string {
    if (category === 'PURCHASETEST') {
      return 'QuestDirect';
    }
    return null;
  }

}
