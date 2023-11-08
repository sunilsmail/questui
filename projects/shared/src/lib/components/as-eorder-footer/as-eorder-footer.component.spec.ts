import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { AsEorderFooterComponent } from './as-eorder-footer.component';
describe('AsEorderFooterComponent', () => {
  let component: AsEorderFooterComponent;
  let fixture: ComponentFixture<AsEorderFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsEorderFooterComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatIconModule, MatButtonModule, MockI18nModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#goToPreviousPage', () => {
    beforeEach(() => {
      it('if the current page is as-eorder-insurance-info page, user should be redirected to as-eorder-personal-info page', () => {
        spyOn(component, 'goToPreviousPage');
        expect(component.previous).toEqual('as-eorder-personal-information');
      });
      it('if the current page is as-eorder-personal-info, then user should be redirected to as-eorder-appt-scheduler', () => {
        spyOn(component, 'goToPreviousPage');
        expect(component.previous).toEqual('as-eorder-appt-scheduler');
      });
      it('if the cuurent page is as-eorder-appt-scheduler, user should be redirected to  as-verify-identity-dialog', () => {
        spyOn(component, 'goToPreviousPage');
        expect(component.previous).toEqual('as-verify-identity-dialog');
      });
    });
  });

  describe('#getAriaLabel return values', () => {
    it('getAriaLabel should return Continue, when not final step', () => {
      component.finalStep = false;
        expect(component.getAriaLabel).toEqual('Continue');
    });
    it('getAriaLabel should return Show Summary, when it is final step', () => {
      component.finalStep = true;
      expect(component.getAriaLabel).toEqual('Finish');
  });
  });
});
