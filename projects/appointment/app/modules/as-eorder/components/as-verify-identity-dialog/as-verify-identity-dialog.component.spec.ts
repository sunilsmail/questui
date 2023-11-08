import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By, DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AsRecaptchaComponent } from 'shared/components/as-recaptcha/as-recaptcha.component';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { VerifyIdentityResponse } from 'shared/models/eOrder-state-navigation';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsVerifyIdentityDialogComponent } from './as-verify-identity-dialog.component';

const mockMatDialogRef = {
  close: () => { }
};

describe('AsVerifyIdentityDialogComponent', () => {
  let component: AsVerifyIdentityDialogComponent;
  let fixture: ComponentFixture<AsVerifyIdentityDialogComponent>;
  let dateService: DateService;
  let eorderService: EorderService;
  let eorderDataService: EorderDataService;
  let sanitizer: DomSanitizer;
  let eorderStateNavigationService: EorderStateNavigationService;
  let propertiesService: PropertiesService;
  const asRecaptchaComponent = jasmine.createSpyObj('AsRecaptchaComponent', ['execute']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsVerifyIdentityDialogComponent, AsRecaptchaComponent],
      imports: [ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        MatAutocompleteModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MockI18nModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule
      ],
      providers: [
        I18nConstantsService, EorderDataService, DateService, Renderer2,
        { provide: EorderService, useClass: MockEorderService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService },
        { provide: PropertiesService, useClass: MockPropertiesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    propertiesService = TestBed.inject(PropertiesService);
    dateService = TestBed.inject(DateService);
    eorderService = TestBed.inject(EorderService);
    eorderDataService = TestBed.inject(EorderDataService);
    sanitizer = TestBed.inject(DomSanitizer);
    eorderStateNavigationService = TestBed.inject(EorderStateNavigationService);
    fixture = TestBed.createComponent(AsVerifyIdentityDialogComponent);
    component = fixture.componentInstance;
    component.recaptcha = asRecaptchaComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on calling closeVerifyIdentityDialog method', () => {
    spyOn(component.dialogRef, 'close');
    component.closeVerifyIdentityDialog();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should calculate the waiting time in minutes on  method', () => {
    const min = component.getWaitTime('2020-06-26T10:14:58');
    expect(min).toBeDefined();
  });

  describe('onkeypressdate', () => {
    beforeEach(() => {
      spyOn(component, 'onkeypressdate');
      fixture.detectChanges();
    });
    it(
      'should get called', () => {
        const eventItem = new KeyboardEvent('keypress', { code: 'Digit2' });
        const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
        dateElement.value = '11221986';
        component.onkeypressdate(eventItem, dateElement);
        expect(component.onkeypressdate).toHaveBeenCalled();
      });

  });

  describe('onkeypressdate()', () => {
    it('should enter / after two digit is entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/');
    });
    it('should not enter / if already entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09/';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/');
    });

    it('should remove one / if entered twice', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09//';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/');
    });
    it('should add / if 5 characters are entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09/09';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/09/');
    });
  });

  describe('#verifyUser', () => {
    beforeEach(() => {
      const response: VerifyIdentityResponse = {
        nextAllowed: null,
        verifyIdentity: 'T',
        authAttempts: 0,
        confirmation: 'ABCDE',
        stateNavigation: null
      };
      spyOn(propertiesService, 'getRecaptchaEnable').and.returnValue(of(false));
      spyOn(eorderService, 'verifyIdentity').and.returnValue(of(response));
    });
    it('it should call', () => {
      component.verifyUser();
      expect(eorderService.verifyIdentity).toHaveBeenCalled();
    });
    it('if Captcha flag is true', () => {
      component.verifyUser();
      expect(eorderService.verifyIdentity).toHaveBeenCalled();
    });
    it('if Captcha flag is false', () => {
      component.verifyUser();
      expect(eorderService.verifyIdentity).toHaveBeenCalled();
    });
  });
});


