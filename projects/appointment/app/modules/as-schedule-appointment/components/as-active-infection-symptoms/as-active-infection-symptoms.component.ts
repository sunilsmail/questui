import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Appointment } from 'shared/models/appointment';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';
// tslint:disable-next-line:max-line-length
import { AsActiveInfectionCommonInfoDialogComponent } from '../as-active-infection-common-info-dialog/as-active-infection-common-info-dialog.component';


@Component({
  selector: 'as-active-infection-symptoms',
  templateUrl: './as-active-infection-symptoms.component.html',
  styleUrls: ['./as-active-infection-symptoms.component.scss']
})
export class AsActiveInfectionSymptomsComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<any>();
  loading = false;
  content = homeContent;
  activeInfectionSymptomsForm: FormGroup;
  previousUrl = '/schedule-appointment/as-reason-for-visit';
  enableContinue: boolean;
  hideInsuranceInfo = true;
  selectedData: Appointment;
  reasonForVisit: ReasonCategory;
  selectedTests: ReasonCategory[];
  reqParams: any;
  previousUrlWithParams: string;
  reasonDataForCompare: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getReasonData();
    this.dataService.getCovidSymptomsData().subscribe(response => {
      console.log('COVID SYMPTOMS', response);
      if (response) {
        this.activeInfectionSymptomsForm.get('preferences').setValue(response);
        if (response.symptom_4) {
          this.symptomsSelection('symptom_4');
        } else {
          this.symptomsSelection('symptoms');
        }
      }
    });
  }

  buildForm() {
    this.activeInfectionSymptomsForm = this.fb.group({
      preferences: new FormGroup({
        symptom_1: new FormControl(false),
        symptom_2: new FormControl(false),
        symptom_3: new FormControl(false),
        symptom_4: new FormControl(false),
        extraSymptom: new FormControl(false),
      }, CustomValidators.requireCheckboxesToBeCheckedValidator()),
    });
  }
  ngOnDestroy() { }
  continueClicked() {
    if ((this.activeInfectionSymptomsForm.get('preferences').value.extraSymptom === 'sym1' ||
      this.activeInfectionSymptomsForm.get('preferences').value.symptom_4) &&
      (!this.activeInfectionSymptomsForm.get('preferences').value.symptom_1 &&
        !this.activeInfectionSymptomsForm.get('preferences').value.symptom_3)
    ) {
      this.dataService.searchCovidAppointmentsBy = 29;
    } else {
      this.dataService.searchCovidAppointmentsBy = 26;
    }
    this.dataService.setCovidSymptomsData(this.activeInfectionSymptomsForm.get('preferences').value);
    this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
  }
  goToPrevious() {
    this.location.back();
  }
  symptomsSelection(event) {
    if (event === 'symptom_4') {
      this.activeInfectionSymptomsForm.get('preferences')['controls'].symptom_1.value = false;
      this.activeInfectionSymptomsForm.get('preferences')['controls'].symptom_2.value = false;
      this.activeInfectionSymptomsForm.get('preferences')['controls'].symptom_3.value = false;
      this.activeInfectionSymptomsForm.get('preferences')['controls'].extraSymptom.value = null;
      this.activeInfectionSymptomsForm.get('preferences').updateValueAndValidity();
    } else {
      this.activeInfectionSymptomsForm.get('preferences')['controls'].symptom_4.value = false;
      this.activeInfectionSymptomsForm.get('preferences').updateValueAndValidity();
    }
    if (this.activeInfectionSymptomsForm.get('preferences').value.symptom_2 === true) {
      if (this.activeInfectionSymptomsForm.get('preferences').value.extraSymptom) {
        this.enableContinue = true;
      } else {
        this.enableContinue = false;
      }
    } else {
      this.activeInfectionSymptomsForm.get('preferences')['controls'].extraSymptom.value = null;
      this.enableContinue = true;
    }
  }
  openModelDialogs(type: string): void {
    if (type === 'symptoms') {
      this.dialog.open(AsActiveInfectionCommonInfoDialogComponent, {
        autoFocus: false,
        maxHeight: '90vh',
        data: {
          header: 'Symptoms may include:',
          content: `<ul class="sym-list">
        <li>Fever</li>
        <li>Cough</li>
        <li>Shortness of breath or difficulty breathing</li>
        <li>Chills</li>
        <li>Repeated shaking with chills</li>
        <li>Muscle pain</li>
        <li>Headache</li>
        <li>Sore throat</li>
        <li>New loss of taste or smell</li>
      </ul>`
        },
      });
    }
    else if (type === 'serve-symptoms') {
      this.dialog.open(AsActiveInfectionCommonInfoDialogComponent, {
        autoFocus: false,
        maxHeight: '90vh',
        data: {
          header: 'Severe symptoms may include:',
          content: `<ul class="sym-list">
          <li>A fever of 102 F or higher</li>
          <li>A fever that has lasted more than 48 hours</li>
          <li>Severe coughing spells or coughing up blood</li>
          <li>Inability to speak full sentences or
            do simple activities without feeling
            short of breath</li>
          <li>Blue lips or face</li>
          <li>Severe and constant chest pain</li>
          <li>Feeling dizzy, lightheaded, or too
            weak to stand</li>
          <li>Feeling very tired or lethargic</li>
          <li>Having slurred speech or seizures</li>
          <li>Feeling unable to stay at home
            due to feeling seriously ill</li>
      </ul>`
        },
      });
    }
    else if (type === 'exposed') {
      this.dialog.open(AsActiveInfectionCommonInfoDialogComponent, {
        autoFocus: false,
        maxHeight: '90vh',
        data: {
          header: 'What it means',
          content: `<p>A suspected exposure means potential casual contact
          (eg, gathering or class) with someone who has recently
          been diagnosed with COVID-19.</p>`
        },
      });
    }
    else if (type === 'known-exposed') {
      this.dialog.open(AsActiveInfectionCommonInfoDialogComponent, {
        autoFocus: false,
        maxHeight: '100vh',
        data: {
          header: 'What it means',
          content: `<p>
          Known exposure includes those who have, in the last 10 days:</p>
          <ul class="sym-list">
          <li>Had close contact to someone
            who has recently been diagnosed
            with COVID-19. Close contact is
            defined as being within 6 feet of
            an individual for 10 minutes or
            more within a 24-hour period,
            starting from 2 days before their
            symptoms developed or if
            asymptomatic, 2 days before they
            were tested. Close contact does
            not include individuals who work
            in a healthcare setting wearing
            appropriate, required personal
            protective equipment.</li>
            <li> Received a positive COVID-19 (e.g.
              antigen) test result.</li>
            <li>Been informed that they are a part
              of a positive pod in a surveillance
              program.</li>
          </ul>
          `
        },
      });
    }
  }
  getReasonData() {
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      if (typeof reasonData === 'string') {
        this.reasonForVisit = reasonData;
        this.reasonDataForCompare = reasonData;
        // this.previousUrl = '/schedule-appointment/as-reason-for-visit';
        this.reqParams = reasonData ? { reason: reasonData } : null;
        this.previousUrlWithParams = reasonData ?
          '/schedule-appointment/as-reason-for-visit?reason=' + reasonData : this.previousUrl;
      } else {
        this.reasonForVisit = reasonData;
        this.reasonDataForCompare = reasonData;
        // this.previousUrl = '/schedule-appointment/as-reason-for-visit';
        this.reqParams = reasonData && reasonData.serviceRequestor ? { reason: reasonData.serviceRequestor } : null;
        this.previousUrlWithParams = reasonData && reasonData.serviceRequestor ?
          '/schedule-appointment/as-reason-for-visit?reason=' + reasonData.serviceRequestor : this.previousUrl;
      }
    });
  }
}
