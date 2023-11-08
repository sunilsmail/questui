import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { AsSecondaryInsuranceUserInfoComponent } from './as-secondary-insurance-userinfo.component';


describe('AsSecondaryInsuranceUserInfoComponent', () => {
  let component: AsSecondaryInsuranceUserInfoComponent;
  let fixture: ComponentFixture<AsSecondaryInsuranceUserInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        CustomPipesModule,
        MockI18nModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      providers: [],
      declarations: [AsSecondaryInsuranceUserInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsSecondaryInsuranceUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onkeypressphone()', () => {
    it('should add - after three digit is entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input[id="sins_phone"]')).nativeElement;
      phoneElement.value = '908';
      component.onkeypressphone(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });
    it('should not enter - if already entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input[id="sins_phone"]')).nativeElement;
      phoneElement.value = '908-';
      component.onkeypressphone(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });

    it('should add - if 7 characters are entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input[id="sins_phone"]')).nativeElement;
      phoneElement.value = '908-332';
      component.onkeypressphone(event, phoneElement);
      expect(phoneElement.value).toEqual('908-332-');
    });

    it('should add set error if 11 characters are entered', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input[id="sins_phone"]')).nativeElement;
      phoneElement.value = '856-854-85555';
      const expectedErrors = { invalidPhoneno: true };
      component.onkeypressphone(event, phoneElement);
      expect(component.form.get('phone').errors).toEqual(expectedErrors);
    });
  });
});
