import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { All_States, GenderFeildsWithState, GenderMandatoryFields, GenderPrefFieldName } from 'shared/models/gender-race-options';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  templateUrl: './as-gender-fields-dialog.component.html',
  styleUrls: ['./as-gender-fields-dialog.component.scss']
})
export class AsGenderFieldsDialogComponent implements OnInit {

  content = homeContent;
  genderFieldsForm: FormGroup;
  buildControlsData: GenderFeildsWithState = null;
  contnent$ = new Observable<any>();

  constructor(
    public dialogRef: MatDialogRef<AsGenderFieldsDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private genderFieldsService: GenderFieldsService,
    private propertiesService: PropertiesService,
    private sanitized: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.contnent$ = this.propertiesService.getTransgenderFieldsPopupContent();
    this.buildForm();
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  buildForm() {
    this.genderFieldsForm = this.fb.group({
      genderPreference: [''],
      race: [''],
      ethnicity: [''],
      sexualOrientation: ['']
    });
    this.buildControlsData = this.genderFieldsService.fieldsWithState;
    this.upateValueAndValidation();
  }

  upateValueAndValidation() {

    for (let i = 0; i <= this.buildControlsData?.genderRaceOptions.length - 1; i++) {
      const control = this.buildControlsData?.genderRaceOptions[i];
      const displayState = this.genderFieldsService.convertToLowerCaseArray(control?.displayState);
      const requiredState = this.genderFieldsService.convertToLowerCaseArray(control?.requiredState);
      const controlname = this.genderFieldsService.getControlname(control.field_name);

      if ((displayState?.includes(All_States) || displayState?.includes(this.buildControlsData?.selectedState?.toLowerCase()))
        && (requiredState?.includes(All_States) || requiredState?.includes(this.buildControlsData?.selectedState?.toLowerCase()))) {
        this.genderFieldsForm.get(controlname).setValidators(Validators.required);
        this.genderFieldsForm.get(controlname).updateValueAndValidity();
      }
      this.genderFieldsForm.get(controlname).patchValue(this.buildControlsData?.genderRaceOptions[i].key);
    }

  }



  get getRace() {
    return this.genderFieldsService.checkFieldAndDisplayReqOptions(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.Race, this.buildControlsData.selectedState);
  }
  get getEthnicity() {
    return this.genderFieldsService.checkFieldAndDisplayReqOptions(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.Ethnicity, this.buildControlsData.selectedState);
  }
  get getGenderPreference() {
    return this.genderFieldsService.checkFieldAndDisplayReqOptions(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.GenderPreference, this.buildControlsData.selectedState);
  }
  get getSexualOrientation() {
    return this.genderFieldsService.checkFieldAndDisplayReqOptions(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.SexualOrientation, this.buildControlsData.selectedState);
  }

  get getRaceValidation() {
    return this.genderFieldsService.checkFieldAndDisplayAndRequired(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.Race, this.buildControlsData.selectedState);
  }
  get getEthnicityValidation() {
    return this.genderFieldsService.checkFieldAndDisplayAndRequired(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.Ethnicity, this.buildControlsData.selectedState);
  }
  get getGenderPreferenceValidation() {
    return this.genderFieldsService.checkFieldAndDisplayAndRequired(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.GenderPreference, this.buildControlsData.selectedState);
  }
  get getSexualOrientationValidation() {
    return this.genderFieldsService.checkFieldAndDisplayAndRequired(this.buildControlsData?.genderRaceOptions,
      GenderPrefFieldName.SexualOrientation, this.buildControlsData.selectedState);
  }

  continue() {
    this.genderFieldsService.setMandatoryFields({ ...this.genderFieldsForm.value });
    this.dialogRef.close(this.genderFieldsForm.value as GenderMandatoryFields);
  }

  openTooltip(e) {
    e.stopPropagation();
  }

  sanitise(htmlString) {
    return this.sanitized.bypassSecurityTrustHtml(htmlString);
  }

}
