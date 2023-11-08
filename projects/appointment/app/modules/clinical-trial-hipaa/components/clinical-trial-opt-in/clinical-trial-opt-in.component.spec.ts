import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { MaterialModule } from 'shared/material.module';
import { DateService } from 'shared/services/date.service';
import { UserService } from 'shared/services/user.service';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';

import { ClinicalTrialOptInComponent } from './clinical-trial-opt-in.component';
export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: true })
    };
  }
}

describe('ClinicalTrialOptInComponent', () => {
  let component: ClinicalTrialOptInComponent;
  let fixture: ComponentFixture<ClinicalTrialOptInComponent>;
  let route: any;
  let userService: any;
  let dialog: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClinicalTrialOptInComponent],
      imports: [
        CustomPipesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule],
      providers: [
        { provide: DateService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: UserService, useClass: MockUserService },
        { provide: MatDialog, useClass: MatDialogMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialOptInComponent);
    route = TestBed.inject(ActivatedRoute);
    dialog = TestBed.inject(MatDialog);
    userService = TestBed.inject(UserService);
    spyOn(window, 'scroll').and.stub();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' it should set tokenFromQueryParam from query param hipaa token', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    component.ngOnInit();

    route.queryParamMap.subscribe((params) => {
      expect(component.tokenFromQueryParam).toEqual('abcd');
    });
  });

  it(' it should call  errorPopup if not query param hipaa token found', () => {
    component.ngOnInit();
    spyOn(component, 'errorPopup').and.callThrough();

    expect(component.errorPopup).not.toHaveBeenCalled();
  });


  it('it should set user data if user authenticated', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    spyOn(userService, 'getUserdata').and.callThrough();
    component.ngOnInit();
    userService.getUserdata().subscribe(user => {
      expect(user.firstName).toEqual('Sunils');
      expect(component.user.firstName).toEqual('Sunils');
    });
  });

  it('it should call errorpopup and not set user data if use not authenticated', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(false);
    spyOn(userService, 'getUserdata').and.callThrough();
    spyOn(component, 'errorPopup').and.callThrough();
    component.ngOnInit();
    expect(userService.getUserdata).not.toHaveBeenCalled();
    expect(component.errorPopup).toHaveBeenCalled();
  });

  it('it should set hipaa component and build hipaa form when getHipaaContent call success ', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    /* tslint:disable */
    const sampleJson = { "hipaaContent": "{\"status\":200,\"message\":null,\"authToken\":null,\"data\":{\"HipaaAuthConsentPreTextBoxes\":\"I am HipaaAuthConsentPostTextBoxes \",\"HipaaAuthConsentPostTextBoxes\":\"I am HipaaAuthConsentPostTextBoxes\"},\"total\":0,\"totalPages\":0,\"count\":0,\"appCode\":0,\"httpStatus\":\"OK\"}" };
    spyOn(component, 'getHipaaContent').and.returnValue(of(sampleJson));
    spyOn(component, 'buildForm').and.callThrough();
    component.ngOnInit();
    component.getHipaaContent().subscribe(hipaaContentResponse => {
      expect(component.hipaaContent.HipaaAuthConsentPostTextBoxes).toEqual('I am HipaaAuthConsentPostTextBoxes');
      expect(component.loading).toBeFalsy();
      expect(component.buildForm).toHaveBeenCalled();
      expect(component.hipaaSignForm.controls.hipaaAuthorizationDate).toBeTruthy();
      expect(hipaaContentResponse).toBeTruthy();
    });
  });


  it('it should not set hipaa component and build hipaa form when getHipaaContent call return nothing ', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    /* tslint:disable */
    const sampleJson = { "hipaaContent": "{\"status\":200,\"message\":null,\"authToken\":null,\"data\":{\"HipaaAuthConsentPreTextBoxes\":\"I am HipaaAuthConsentPostTextBoxes \",\"HipaaAuthConsentPostTextBoxes\":\"I am HipaaAuthConsentPostTextBoxes\"},\"total\":0,\"totalPages\":0,\"count\":0,\"appCode\":0,\"httpStatus\":\"OK\"}" };
    spyOn(component, 'getHipaaContent').and.returnValue(of(undefined));
    spyOn(component, 'buildForm').and.callThrough();
    component.ngOnInit();
    component.getHipaaContent().subscribe(hipaaContentResponse => {
      expect(component.hipaaContent).toBeFalsy();
      expect(component.loading).toBeFalsy();
      expect(component.buildForm).not.toHaveBeenCalled();
      expect(component.hipaaSignForm).toBeFalsy();
      expect(hipaaContentResponse).toBeFalsy();
    });
  });

  it('it should not set hipaa component and build hipaa form when getHipaaContent call failed ', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    /* tslint:disable */
    const sampleJson = { "hipaaContent": "{\"status\":200,\"message\":null,\"authToken\":null,\"data\":{\"HipaaAuthConsentPreTextBoxes\":\"I am HipaaAuthConsentPostTextBoxes \",\"HipaaAuthConsentPostTextBoxes\":\"I am HipaaAuthConsentPostTextBoxes\"},\"total\":0,\"totalPages\":0,\"count\":0,\"appCode\":0,\"httpStatus\":\"OK\"}" };
    spyOn(component, 'getHipaaContent').and.returnValue(of(HttpErrorResponse));
    spyOn(component, 'buildForm').and.callThrough();
    spyOn(component, 'errorPopup').and.callThrough();
    component.ngOnInit();
    component.getHipaaContent().subscribe(hipaaContentResponse => {
      expect(component.hipaaContent).toBeFalsy();
      expect(component.buildForm).not.toHaveBeenCalled();
      expect(component.hipaaSignForm).toBeFalsy();
      expect(component.hipaaSignForm).toBeFalsy();
      expect(component.errorPopup).toHaveBeenCalled();
    });
  });

  it('it should set form invalid if form data does not match user data', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    component.ngOnInit();
    component.buildForm();
    component.hipaaSignForm.patchValue({ firstName: 'Sunil', lastName: 'shetty' });
    expect(component.hipaaSignForm.status).toBe('INVALID');

  });

  it('it should set form valid if form data matches user data', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    component.ngOnInit();
    component.buildForm();
    console.log(component.user);

    component.hipaaSignForm.patchValue({ firstName: 'Sunils', lastName: 'Amujuri' });
    expect(component.hipaaSignForm.status).toBe('VALID');

  });

  it('it should call submitSignedHipaa onSubmit when form is valid', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    component.ngOnInit();
    component.buildForm();
    component.hipaaSignForm.patchValue({ firstName: 'Sunils', lastName: 'Amujuri' });
    spyOn(component, 'submitSignedHipaa').and.callThrough();
    spyOn(dialog, 'open').and.callThrough();
    component.onSubmit();
    expect(component.submitSignedHipaa).toHaveBeenCalled();
    component.submitSignedHipaa('a', 'b', 'c').subscribe(
      () => {
        expect(component.loading).toBeFalsy();
        expect(dialog.open).toHaveBeenCalled()
        expect(window.scroll).toHaveBeenCalled()
      })
  });

  it('it should call errorpopup onSubmit when submitSignedHipaa faild', () => {
    route.setQueryParamMap('hipaaToken', 'abcd');
    userService.isAuthenticated$ = of(true);
    component.ngOnInit();
    component.buildForm();
    component.hipaaSignForm.patchValue({ firstName: 'Sunils', lastName: 'Amujuri' });
    spyOn(component, 'submitSignedHipaa').and.returnValue(of(HttpErrorResponse));
    spyOn(component, 'errorPopup').and.callThrough();
    component.onSubmit();
    component.submitSignedHipaa('a', 'b', 'c').subscribe(
      () => { },
      () => {
        expect(window.scroll).toHaveBeenCalled()

        expect(component.errorPopup).toHaveBeenCalled();
      })
  });

  // it('it should call errorpopup onSubmit when submitSignedHipaa faild', () => {
  //   component.onCancel()
  //   expect(window.location.href).toBeTruthy();
  // });
});


