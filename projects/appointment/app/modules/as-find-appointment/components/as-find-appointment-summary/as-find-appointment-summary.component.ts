import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { combineLatest, forkJoin, of, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InsuranceData, InsuranceProvider, PatientAddressInfo, PersonalData, SecondaryInsuranceData, UserDemographic } from 'shared/models';
import { AppointmentDetails, ModifyAppointmentData, ModifyCancelAppointmentData } from 'shared/models/appointment';
import { Calendar } from 'shared/models/calendar';
import { PrintData } from 'shared/models/print-data';
import { PscAvailabilityQuery, PscDetails, PscLocationAvailability } from 'shared/models/psc';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { UserService } from 'shared/services/user.service';
import { getValueByKeys } from 'shared/utils/util';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsCancelAppointmentDialogComponent } from '../as-cancel-appointment-dialog/as-cancel-appointment-dialog.component';
import { AsVerifyPhoneDialogComponent } from '../as-verify-phone-dialog/as-verify-phone-dialog.component';

@Component({
  selector: 'as-find-appointment-summary',
  templateUrl: './as-find-appointment-summary.component.html',
  styleUrls: ['./as-find-appointment-summary.component.scss']
})
export class AsFindAppointmentSummaryComponent implements OnInit, OnDestroy {
  facilityTestTypeValue: any;
  confirmationCode: string;
  pscDetails: PscDetails;
  pscLocationAvailability: PscLocationAvailability;
  destroy$ = new Subject<void>();
  appointmentDetails: AppointmentDetails;
  calendarData = new Calendar();
  printData = new PrintData();
  loading = false;
  personalData: PersonalData = new PersonalData();
  insuranceData: InsuranceData = new InsuranceData();
  isAuthenticated$: Observable<boolean>;
  isLoggedIn = false;
  bringCarderror: boolean;
  value: string;
  isCancelRequestFromMyQuest = false;
  skipInsurance$: Observable<boolean>;
  secondaryInsData: SecondaryInsuranceData = new SecondaryInsuranceData();
  content = homeContent;
  mandatoryAddressf1687 = false;

  constructor(
    private matDialog: MatDialog,
    private pscService: PscService,
    private route: ActivatedRoute,
    private findAppointmentService: FindAppointmentService,
    public dataService: DataService,
    private appointmentService: AppointmentService,
    private router: Router,
    private dateService: DateService,
    private insuranceService: InsuranceService,
    private userService: UserService,
    private skipInsuranceService: SkipInsuranceService,
    private datePipe: DatePipe,
    private propertiesService: PropertiesService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private genderFieldsService: GenderFieldsService) {
    this.isAuthenticated$ = this.userService.isAuthenticated$;
  }

  ngOnInit() {
    this.dataService.setModifyInsurance(true);
    this.readFlagMandatoryAddressf1687();
    this.getSecondaryInsuranceData();
    this.route.queryParams
      .subscribe(params => {
        if (params) {
          if (params.confirmationCode) {
            this.confirmationCode = params.confirmationCode;
          }
          if (params.cancelFromMQ && params.cancelFromMQ === 'true') {
            this.isCancelRequestFromMyQuest = true;
          }
        }
      });
    this.loading = true;
    combineLatest([this.userService.isAuthenticated$, this.propertiesService.getMandatoryAddressf1687()]).subscribe(([isAuth, f1687]) => {
      this.isLoggedIn = isAuth;
      this.mandatoryAddressf1687 = f1687;
      this.getSummaryDetials();
    });
    // this.userService.isAuthenticated$.subscribe((isAuth) => {
    //   this.isLoggedIn = isAuth;
    //   this.getSummaryDetials();
    // });
    this.getCancelModifyDetails();
    this.skipInsurance$ = this.skipInsuranceService.getSkipInsurance();
  }

  readFlagMandatoryAddressf1687() {
    this.propertiesService.getMandatoryAddressf1687().subscribe((val) => {
      this.mandatoryAddressf1687 = val;
    });
  }

  private getSummaryDetials() {
    this.getAppointmentDetails()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((response: AppointmentDetails) => {
          this.genderFieldsService.userPersonalData = response.demographicDetails;
          if (response['message'] === 'cancelled') {
            this.router.navigate(['./']);
            return of(null);
          }
          this.appointmentDetails = response;
          if (this.appointmentDetails && this.appointmentDetails.insuranceDetails) {
            this.appointmentDetails.insuranceDetails.secondaryInsOptOut = this.appointmentDetails.secondaryInsOptOut;
          }
          if (response.secondaryInsurance) {
            const insData = this.secondaryInsuranceService.
              formatSecondaryInsuranceForControls(response.secondaryInsurance, this.mandatoryAddressf1687);
            this.secondaryInsuranceService.setInsuranceData(insData);
          }
          if (!this.dataService.isModifyCancel) {
            this.skipInsuranceService.setSkipInsurance(this.appointmentDetails.skipInsurance ?
              this.appointmentDetails.skipInsurance : false);
          }
          const params: PscAvailabilityQuery = {
            siteCode: response.siteCode,
            date: response.appointmentDate,
            serviceType: null,
            facilityServiceId: response.facilityServiceId,
            fromDate: response.appointmentDate,
            toDate: response.appointmentDate
          };
          return forkJoin(this.getLocationDetails(response.siteCode).pipe(takeUntil(this.destroy$)),
            this.pscService.getPscAvailability(params).pipe(takeUntil(this.destroy$)),
            this.getReasons().pipe(takeUntil(this.destroy$)));
        })).subscribe(([pscDetails, pscLocationAvailability, reasons]) => {
          this.pscDetails = pscDetails;
          this.pscLocationAvailability = pscLocationAvailability;
          const location = {
            latitude: pscDetails.latitude, longitude: pscDetails.longitude
          };
          this.dataService.setUserLocation(location);
          this.setFacilityTestTypeValue(reasons);
          this.setPrintData();
          this.setCalendarData();
          this.loading = false;
          if (this.isLoggedIn && !this.dataService.isModifyCancel) {
            this.mapSummaryInsuranceToInsuranceInfo();
          }
          if (this.isCancelRequestFromMyQuest) {
            this.cancelAppointment('CANCEL');
          }
        }, (error) => {
          this.loading = false;
          this.router.navigate(['./']);
          return of(null);
        });
  }
  setPrintData() {
    this.printData.appointmentDate = this.appointmentDetails.appointmentDate;
    this.printData.appointmentTime = this.appointmentDetails.appointmentTime;
    this.printData.name = this.pscDetails.name;
    this.printData.address1 = this.pscDetails.address1;
    this.printData.address2 = this.pscDetails.address2;
    this.printData.city = this.pscDetails.city;
    this.printData.zip = this.pscDetails.zip;
    this.printData.state = this.pscDetails.state;
    this.printData.phone = this.pscDetails.phone;
    this.printData.siteCode = this.appointmentDetails.siteCode;
    this.printData.facilityTestTypeValue = this.facilityTestTypeValue;
    this.printData.confirmationCode = this.confirmationCode;
    this.printData.qrcode = 'data:image/png;base64,' + this.appointmentDetails.qrCode + '';
    this.printData.firstName = this.appointmentDetails.firstName;
    const city = this.pscDetails.phone.toString().slice(0, 3);
    const number = this.pscDetails.phone.toString().slice(3);
    this.printData.sitePhone = ('(' + city + ') ' + number).trim();
    this.printData.landmark = this.pscDetails.landmark;
  }
  setCalendarData() {
    this.calendarData.appointmentDate = this.appointmentDetails.appointmentDate;
    this.calendarData.appointmentTime = this.appointmentDetails.appointmentTime;
    this.calendarData.name = this.pscDetails.name;
    this.calendarData.address1 = this.pscDetails.address1;
    this.calendarData.address2 = this.pscDetails.address2;
    this.calendarData.city = this.pscDetails.city;
    this.calendarData.zip = this.pscDetails.zip;
    this.calendarData.state = this.pscDetails.state;
    this.calendarData.phone = this.pscDetails.phone;
    this.calendarData.siteCode = this.appointmentDetails.siteCode;
    this.calendarData.title = this.facilityTestTypeValue;
    this.calendarData.confirmationCode = this.confirmationCode;
    this.calendarData.zoneId = this.appointmentDetails.zoneId;
    this.calendarData.time_zone = this.appointmentDetails.time_zone;
  }
  setFacilityTestTypeValue(reasons: ReasonCategory[]) {
    const multiDrugTestLabel = 'Multiple Drug tests';
    if (this.appointmentDetails.actualReasonForVisit && this.appointmentDetails.actualReasonForVisit.length > 0) {
      if (this.appointmentDetails.actualReasonForVisit.length > 1) {
        this.facilityTestTypeValue = multiDrugTestLabel;
      } else {
        this.facilityTestTypeValue = this.appointmentDetails.actualReasonForVisit[0];
      }
    } else {
      const kitCollectionIds = [32, 34];
      if (this.appointmentDetails.facilityServiceId.length > 1) {
        if (this.appointmentDetails.facilityServiceId.some(facilityId => kitCollectionIds.includes(facilityId))) {
          this.facilityTestTypeValue = this.appointmentDetails.appointmentVisitReason;
        } else {
          this.facilityTestTypeValue = multiDrugTestLabel;
        }
      } else {
        const result = reasons.find(({ facilityServiceId }) => facilityServiceId === this.appointmentDetails.facilityServiceId[0]);
        this.facilityTestTypeValue = result !== undefined ? result.facilityTestTypeValue : '';
      }
    }
  }

  getAppointmentDetails(): Observable<AppointmentDetails> {
    // checking appointment details exist, else do api call
    if (this.findAppointmentService.appointmentDetails) {
      return of(this.findAppointmentService.appointmentDetails);
    } else {
      return this.findAppointmentService.verifyAppointmentId(this.confirmationCode, this.isLoggedIn);
    }
  }

  getLocationDetails(siteCode: string): Observable<PscDetails> {
    return this.pscService.getPscDetails(siteCode);
  }

  getReasons(): Observable<ReasonCategory[]> {
    if (this.appointmentDetails.facilityServiceId.length > 0) {
      // tslint:disable-next-line: max-line-length
      if (this.appointmentDetails.facilityServiceId[0] <= 6) {
        return this.appointmentService.getReasons('MAIN', null, true);
      }
      else if (this.appointmentDetails.facilityServiceId[0] >= 7 && this.appointmentDetails.facilityServiceId[0] < 15
        || this.appointmentDetails.facilityServiceId[0] === 18 || this.appointmentDetails.facilityServiceId[0] === 20) {
        return this.appointmentService.getReasons('EMPLOYER', null, true);
      }
      else if (this.appointmentDetails.facilityServiceId[0] >= 15 && this.appointmentDetails.facilityServiceId[0] <= 16) {
        return this.appointmentService.getReasons('GLUCOSE', null, true);
      }
      else {
        return this.appointmentService.getReasons('MAIN', null, true);
      }
    }
  }

  printConfirmation() {
    window.print();
  }
  cancelAppointment(flow: string) {
    if (this.appointmentDetails.skipVerifyIdentity === false) {
      this.openVerificationDialog(flow);
    } else {
      this.skipVerificationDialog(flow);
    }
  }
  onEdit(flow: string) {
    // this.dataService.editScreenName = screenName;
    this.dataService.isInFLow = true;
    const modifyAppointmentData: ModifyAppointmentData = {
      pscDetails: this.pscDetails,
      pscLocationAvailability: this.pscLocationAvailability,
      appointmentDetails: this.appointmentDetails,
      confirmationCode: this.confirmationCode,
      insuranceDetails: this.appointmentDetails.insuranceDetails,
      guarantor: this.appointmentDetails.guarantor,
      demographicDetails: this.appointmentDetails.demographicDetails
    };
    this.dataService.setappointmentDataForEdit(modifyAppointmentData);
    if (this.appointmentDetails.skipVerifyIdentity === false) {
      this.openVerificationDialog(flow);
    } else {
      this.skipVerificationDialog(flow);
    }
  }
  private authEditPersonalInfo() {
    const user: UserDemographic = {
      firstName: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'firstName']),
      middleInitial: '',
      lastName: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'lastName']),
      // tslint:disable-next-line: max-line-length
      //  dateOfBirth: this.datePipe.transform(this.dateService.toDate(getValueByKeys(this.appointmentDetails, ['demographicDetails', 'dob'])), 'MM-dd-yyyy'),
      dateOfBirth: this.getDate(),
      sex: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'gender']) === 'M' ? 'Male' : 'Female',
      primaryPhone: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'phone']),
      phoneType: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'phoneType']),
      secondaryPhone: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'phone']),
      email: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'emailAddress']),
      address1: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'address']),
      address2: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'address2']),
      city: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'city']),
      state: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'state']),
      zipCode: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'zip']),
      genderPreference: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'genderPreference']),
      isAuthEditFlow: true,
      preferences: {
        preference_email: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'emailOptIn']),
        preference_mobile: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'smsOptIn']),
      },
      patientAddressInfo: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'patientAddressInfo']),
      race: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'race']),
      ethnicity: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'ethnicity']),
      sexualOrientation: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'sexualOrientation'])
    };
    this.userService.setUserdata(user);
  }
  /* Time stamp converted to multiple locale using moment*/
  getDate() {
    const date = getValueByKeys(this.appointmentDetails, ['demographicDetails', 'dob']);
    return moment(date).format('L');
  }

  openVerificationDialog(flow) {
    this.matDialog.open(AsVerifyPhoneDialogComponent, {
      height: 'auto', maxWidth: '100vw', disableClose: true,
      data: {
        confirmationCode: this.confirmationCode,
        name: this.pscDetails.name,
        address1: this.pscDetails.address1,
        address2: this.pscDetails.address2,
        city: this.pscDetails.city,
        state: this.pscDetails.state,
        zip: this.pscDetails.zip,
        appointmentDate: this.appointmentDetails.appointmentDate,
        appointmentTime: this.appointmentDetails.appointmentTime,
        flow: flow,
        siteCode: this.pscDetails.siteCode,
        phone: this.pscDetails.phone,
      }
    });
  }
  skipVerificationDialog(flow) {
    switch (flow) {
      case 'CANCEL':
        this.matDialog.open(AsCancelAppointmentDialogComponent, {
          height: 'auto', width: '696px', disableClose: true,
          data: {
            confirmationCode: this.confirmationCode,
            phone: this.appointmentDetails.demographicDetails.phone,
            name: this.pscDetails.name,
            address1: this.pscDetails.address1,
            address2: this.pscDetails.address2,
            city: this.pscDetails.city,
            state: this.pscDetails.state,
            zip: this.pscDetails.zip,
            appointmentDate: this.appointmentDetails.appointmentDate,
            appointmentTime: this.appointmentDetails.appointmentTime,
          }
        });
        break;
      case 'EditLocation':
        const data = {
          appointmentDate: this.appointmentDetails.appointmentDate,
          appointmentTime: this.appointmentDetails.appointmentTime,
          siteCode: this.pscDetails.siteCode,
          name: this.pscDetails.name,
          address1: this.pscDetails.address1,
          address2: this.pscDetails.address2,
          city: this.pscDetails.city,
          state: this.pscDetails.state,
          zip: this.pscDetails.zip,
          phone: this.pscDetails.phone,
        };
        this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
        this.dataService.setappointmentData({ data: data, selectedIndex: -1 });
        this.dataService.setInsuranceData(null);
        this.dataService.setPersonalData(null);
        break;
      case 'EditInsuranceInfo':
        this.dataService.setPersonalData(null);
        this.dataService.setappointmentData(null);
        this.router.navigate(['/schedule-appointment/as-insurance-information']);
        break;
      case 'EditwhoisVisiting':
        this.router.navigate(['/schedule-appointment/as-personal-information']);
        this.authEditPersonalInfo();
        this.dataService.setappointmentData(null);
        this.dataService.setInsuranceData(null);
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    // this.dataService.isModifyCancel = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
  openDirection() {
    const pscAddress = this.pscDetails ?
      (`${this.pscDetails.name} ${this.pscDetails.address1} (${this.pscDetails.address2} ?
      (${this.pscDetails.address2}) : '')${this.pscDetails.city}`) : '';
    window.open(`http://maps.google.com/maps?daddr=${pscAddress}`, '_blank');
  }

  navigate(routeUrl: string, screenName: string) {
    this.loading = true;
    try {
      this.dataService.editScreenName = screenName;
      this.dataService.isInFLow = true;
      this.validatePatientAddress();
      const modifyAppointmentData: ModifyCancelAppointmentData = {
        pscDetails: this.pscDetails,
        pscLocationAvailability: this.pscLocationAvailability,
        appointmentDetails: this.appointmentDetails,
        confirmationCode: this.confirmationCode,
        insuranceData: this.insuranceData,
        demographicData: this.personalData
      };
      //  this.appointmentDetails.confirmationCode = this.confirmationCode;
      this.dataService.setmodifyAppointmentDataForEdit(modifyAppointmentData);
      this.router.navigate([routeUrl]);
      this.loading = false;
    }
    catch (ex) {
      this.loading = false;
    }
  }

  validatePatientAddress() {
    if (this.personalData) {
      const personAddress = { ...this.personalData.patientAddressInfo };
      if (personAddress && (!personAddress.address1 || !personAddress.zipCode || !personAddress.city)) {
        this.personalData.patientAddressInfo = new PatientAddressInfo();
      }
    }
  }

  getCancelModifyDetails() {
    if (this.dataService.isModifyCancel) {
      this.getPersonalData();
      this.getInsuranceData();
    }
  }

  getPersonalData() {
    this.dataService.getPersonalData().pipe(takeUntil(this.destroy$)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
    });
  }
  getInsuranceData() {
    this.dataService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((insuranceData: InsuranceData) => {
      this.insuranceData = insuranceData;
    });
  }

  mapSummaryInsuranceToInsuranceInfo() {
    if (getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insCompanyName'])) {
      this.insuranceService.getInsuranceProvider(this.appointmentDetails.siteCode)
        .subscribe((response: InsuranceProvider[]) => {
          const value = getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insCompanyName']);
          const count = response.filter(x => x.insuranceCompanyName === value);
          if (count.length > 0) {
            this.mapFields(false);
            this.bringCarderror = false;
          } else {
            this.mapFields(true);
            this.bringCarderror = true;
          }
        });
    } else {
      this.mapFields(false);
      this.bringCarderror = false;
    }
    this.mapFields(this.bringCarderror);
  }

  private mapFields(bringCard: boolean) {
    const InsuranceInfo = {
      data: {
        sameas: getValueByKeys(this.appointmentDetails, ['guarantor', 'address']) === null ? false : true,
        provider: {
          insuranceCompanyName: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insCompanyName']),
          insuranceMnemonic: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insMnemonic']),
        },
        memberId: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insMemberId']),
        groupId: null,
        relationship: getValueByKeys(this.appointmentDetails, ['guarantor', 'relationship']),
        address1: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'address']),
        address2: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'address2']),
        city: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'city']),
        state: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'state']),
        zipCode: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'zip']),
        isPrimaryInsuranceHolder: getValueByKeys(this.appointmentDetails, ['guarantor', 'firstName']) === null ? 'true' : 'false',
        firstName: getValueByKeys(this.appointmentDetails, ['guarantor', 'firstName']),
        lastName: getValueByKeys(this.appointmentDetails, ['guarantor', 'lastName']),
        // dateOfBirth: this.dateService.toDate(this.appointmentDetails.guarantor.dateOfBirth),
        dateOfBirth: getValueByKeys(this.appointmentDetails, ['guarantor', 'dateOfBirth']),
        gender: getValueByKeys(this.appointmentDetails, ['guarantor', 'gender']) === 'M' ? 'Male' :
          getValueByKeys(this.appointmentDetails, ['guarantor', 'gender']) === 'F' ? 'female' : null,
        phone: getValueByKeys(this.appointmentDetails, ['guarantor', 'phone']),
        labCard: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'labCard']).toString(),
        differentPersonalAddress: {
          address1: getValueByKeys(this.appointmentDetails, ['guarantor', 'address']),
          address2: getValueByKeys(this.appointmentDetails, ['guarantor', 'address2']),
          city: getValueByKeys(this.appointmentDetails, ['guarantor', 'city']),
          state: getValueByKeys(this.appointmentDetails, ['guarantor', 'state']),
          zipCode: getValueByKeys(this.appointmentDetails, ['guarantor', 'zip'])
        },
        secondaryInsurance: (!this.appointmentDetails.secondaryInsOptOut).toString(),
        patientAddressInfo: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'patientAddressInfo'])
      },
      bringCarderror: bringCard,
      firstName: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'firstName']),
    };
    if (this.mandatoryAddressf1687) {
      const InsuranceInfo1687 = {
        data: {
          sameas: this.getSameas(),
          provider: {
            insuranceCompanyName: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insCompanyName']),
            insuranceMnemonic: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insMnemonic']),
          },
          memberId: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insMemberId']),
          groupId: null,
          relationship: getValueByKeys(this.appointmentDetails, ['guarantor', 'relationship']),
          isPrimaryInsuranceHolder: getValueByKeys(this.appointmentDetails, ['guarantor', 'firstName']) === null ? 'true' : 'false',
          firstName: getValueByKeys(this.appointmentDetails, ['guarantor', 'firstName']),
          lastName: getValueByKeys(this.appointmentDetails, ['guarantor', 'lastName']),
          // dateOfBirth: this.dateService.toDate(this.appointmentDetails.guarantor.dateOfBirth),
          dateOfBirth: getValueByKeys(this.appointmentDetails, ['guarantor', 'dateOfBirth']),
          gender: getValueByKeys(this.appointmentDetails, ['guarantor', 'gender']) === 'M' ? 'Male' :
            getValueByKeys(this.appointmentDetails, ['guarantor', 'gender']) === 'F' ? 'female' : null,
          phone: getValueByKeys(this.appointmentDetails, ['guarantor', 'phone']),
          labCard: getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'labCard']).toString(),
          addressInfo: {
            address1: getValueByKeys(this.appointmentDetails, ['guarantor', 'address']),
            address2: getValueByKeys(this.appointmentDetails, ['guarantor', 'address2']),
            city: getValueByKeys(this.appointmentDetails, ['guarantor', 'city']),
            state: getValueByKeys(this.appointmentDetails, ['guarantor', 'state']),
            zipCode: getValueByKeys(this.appointmentDetails, ['guarantor', 'zip'])
          },
          secondaryInsurance: (!this.appointmentDetails.secondaryInsOptOut).toString()
        },
        bringCarderror: bringCard,
        firstName: getValueByKeys(this.appointmentDetails, ['demographicDetails', 'firstName']),
      };
      this.dataService.setInsuranceData(InsuranceInfo1687);
    } else {
      this.dataService.setInsuranceData(InsuranceInfo);
    }

    // if (getValueByKeys(this.appointmentDetails, ['insuranceDetails', 'insMnemonic'])) {
    //   this.dataService.setInsuranceData(InsuranceInfo);
    // } else {
    //   this.dataService.setInsuranceData(null);
    // }

  }

  getSameas() {
    return !getValueByKeys(this.appointmentDetails, ['primaryInsAddressSame']) &&
      getValueByKeys(this.appointmentDetails, ['guarantor', 'firstName']) ? true : false;
  }

  getSecondaryInsuranceData() {
    this.secondaryInsuranceService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((secondaryIns: SecondaryInsuranceData) => {
      this.secondaryInsData = secondaryIns;
    });
  }
}
