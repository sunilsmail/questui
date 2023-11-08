import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsSecInsDisplayComponent } from './as-sec-ins-display.component';


describe('AsSecInsComponent', () => {
  let component: AsSecInsDisplayComponent;
  let fixture: ComponentFixture<AsSecInsDisplayComponent>;

  const insData = {
    provider: {
      insuranceCompanyName: 'AETNA',
      insuranceMnemonic: 'AUSHC'
    },
    memberId: 'W987654321',
    groupId: '1234',
    isPrimaryInsuranceHolder: 'false',
    address1: '45040 Corte Rosa',
    address2: '',
    city: 'Temecula',
    state: 'CA',
    zipCode: '92592',
    userInfo: {
      firstName: 'firstname',
      lastName: 'lastname',
      dateOfBirth: '1999-12-31T18:30:00.000Z',
      gender: 'Male',
      phone: '2012019999',
      relationship: 'Spouse'
    },
    bringCarderror: null
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsSecInsDisplayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsSecInsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('when insurance not provided in review screen', () => {
  //   component.insuranceData = null;
  //   component.screenName = 'review';
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelectorAll('#sec_ins_not_found').length).toBeLessThanOrEqual(0);
  //   expect(compiled.querySelectorAll('#sec_ins_companyname').length).toBeLessThanOrEqual(0);
  //   expect(compiled.querySelectorAll('#sec_ins_memberId').length).toBeLessThanOrEqual(0);
  //   // expect(compiled.querySelectorAll('#sec_ins_not_provided_review_screen').length).toBeLessThanOrEqual(1);
  //   expect(compiled.querySelectorAll('#sec_ins_not_provided_summary_screen').length).toBeLessThanOrEqual(0);
  // });
  // it('when insurance not provided in summary details screen', () => {
  //   component.insuranceData = null;
  //   component.screenName = 'summary';
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelectorAll('#sec_ins_not_found').length).toBeLessThanOrEqual(0);
  //   expect(compiled.querySelectorAll('#sec_ins_companyname').length).toBeLessThanOrEqual(0);
  //   expect(compiled.querySelectorAll('#sec_ins_memberId').length).toBeLessThanOrEqual(0);
  //   // expect(compiled.querySelectorAll('#sec_ins_not_provided_review_screen').length).toBeLessThanOrEqual(0);
  //   expect(compiled.querySelectorAll('#sec_ins_not_provided_summary_screen').length).toBeLessThanOrEqual(1);
  // });
  it('show valid insurance', () => {
    component.screenName = 'review';
    component.insuranceData = insData;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('#sec_ins_not_found').length).toBeLessThanOrEqual(0);
    expect(compiled.querySelectorAll('#sec_ins_companyname').length).toBeLessThanOrEqual(1);
    expect(compiled.querySelectorAll('#sec_ins_memberId').length).toBeLessThanOrEqual(1);
    // expect(compiled.querySelectorAll('#sec_ins_not_provided_review_screen').length).toBeLessThanOrEqual(0);
    // expect(compiled.querySelectorAll('#sec_ins_not_provided_summary_screen').length).toBeLessThanOrEqual(0);
  });
  it('show bring card error', () => {
    component.screenName = 'review';
    const secInsData = JSON.parse(JSON.stringify(insData));
    secInsData.provider.insuranceMnemonic = null;
    component.insuranceData = secInsData;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('#sec_ins_not_found').length).toBeLessThanOrEqual(1);
    expect(compiled.querySelectorAll('#sec_ins_companyname').length).toBeLessThanOrEqual(0);
    expect(compiled.querySelectorAll('#sec_ins_memberId').length).toBeLessThanOrEqual(0);
    // expect(compiled.querySelectorAll('#sec_ins_not_provided_review_screen').length).toBeLessThanOrEqual(0);
    // expect(compiled.querySelectorAll('#sec_ins_not_provided_summary_screen').length).toBeLessThanOrEqual(0);
  });
});
