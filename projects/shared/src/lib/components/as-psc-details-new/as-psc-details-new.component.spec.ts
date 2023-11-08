import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { pscs } from 'app/mocks/pscs';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { PscLocationAvailability } from 'shared/models';
import { DataService } from 'shared/services/data.service';
import { FindlocationDataService } from 'shared/services/findLocation/findlocation-data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { UserService } from 'shared/services/user.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { MockFindLocationDataService } from 'shared/specs/mocks/pact/mock-findLocation.service';
import { AsLocationDetailsDialogComponent } from '../as-location-details-dialog/as-location-details-dialog.component';
import { AsPscDetailsNewComponent } from './as-psc-details-new.component';

describe('AsPscDetailsNewComponent', () => {
  let component: AsPscDetailsNewComponent;
  let fixture: ComponentFixture<AsPscDetailsNewComponent>;
  let pscService: PscService;
  let dataService: DataService;
  let pscDetailsService: PscDetailsService;
  let propertiesService: PropertiesService;
  let findlocationService: FindlocationDataService;
  let userService: UserService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsPscDetailsNewComponent,AsLocationDetailsDialogComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MockI18nModule, CustomPipesModule,MatDialogModule],
      providers: [
        { provide: PscService, useClass: MockPscService },
        { provide: DataService, useClass: MockDataService },
        { provide: PscDetailsService, useClass: MockPscDetailsService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: FindlocationDataService, useClass: MockFindLocationDataService},
        { provide: UserService, useClass: MockUserService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AsLocationDetailsDialogComponent],}
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(AsPscDetailsNewComponent);
    pscService = TestBed.inject(PscService);
    dataService = TestBed.inject(DataService);
    pscDetailsService = TestBed.inject(PscDetailsService);
    propertiesService = TestBed.inject(PropertiesService);
    findlocationService = TestBed.inject(FindlocationDataService);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    component.psc = pscs[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('morningSlots', () => {
    it('should include 8:00', () => {
      expect(component.morningSlots).toContain({ time: '8:00', available: true });
    });

    it('should not include 12:00', () => {
      expect(component.morningSlots).not.toContain({ time: '12:00', available: true });
    });
  });

  describe('afternoonSlots', () => {
    it('should include 14:00', () => {
      expect(component.afternoonSlots).toContain({ time: '14:00', available: true });
    });

    it('should not include 8:00', () => {
      expect(component.afternoonSlots).not.toContain({ time: '8:00', available: true });
    });
  });

  describe('hasMorning$ is true', () => {
    it('should set morning to true', () => {
      pscService.hasMorning$.subscribe((res) => {
        expect(component.morning).toBeTruthy();
      });
    });
  });

  describe('selectedTime', () => {
    it('should set morning to true', () => {
      spyOn(component.newAppt, 'emit');
      component.data = {siteCode :1};
      component.selectedTime('8:00');
      expect(component.newAppt.emit).toHaveBeenCalled();
      component.selectedTime('');
    });
    it('should set morning to false', () => {
      spyOn(component.newAppt, 'emit');
      component.selectedTime(null);
      expect(component.newAppt.emit).toHaveBeenCalled();
    });
  });

  describe('ariaLabelAssembly', () => {
    it('should set distanceAria', () => {
      component.ariaLabelAssembly();
      expect(component.distanceAria).toBe('Distance from your location: 5 miles');
    });
    it('should set pscNameAria', () => {
      component.ariaLabelAssembly();
      expect(component.pscNameAria).
        toBe('Quest Diagnostics - Voorhees location: 95 Madison Ave City: Morristown State: NJ Zip: 07960-7357');
    });
  });
  describe('enableContinueButton()', () => {
    it('should set value for enableContinueButton', () => {
      spyOn(component.enableContinue, 'emit');
      component.enableContinueButton(true);
      expect(component.enableContinue.emit).toHaveBeenCalled();
    });
  });
  describe('onSelectedLocation()',()=>{
    it('set value for selected location',()=>{
     spyOn(component.selectedLocation,'emit');
     component.onSelectedLocation();
     expect(component.selectedLocation.emit).toHaveBeenCalled();
    });
  });
  describe('filterTiming()',()=>{
    it('set time for filter',()=>{
      spyOn(component,'filterTiming').and.callThrough();
      component.filterTiming('8:00');
      expect(component.filterTiming).toHaveBeenCalled();
    });
  });
  describe('getUserLocation()',()=>{
    it('should set location data',()=>{
      spyOn(component,'getUserLocation').and.callThrough();
      component.getUserLocation();
      dataService.getUserLocation().subscribe(res=>{
        expect(res).toEqual({ data: Object({ latitude: 5, longitude: 5 }) });
      });
    });
  });

  describe('#setPsc', () => {
    it('set schedule Appt to false', () => {
      const req = new PscLocationAvailability();
      component.setPsc(req);
      req.scheduleAppt = false;
      expect(component._psc).toEqual(req);
    });
    it('setScheduleAppt have to be called 0 time', () => {
      const req = new PscLocationAvailability();
      spyOn(component,'setScheduleAppt').and.callThrough();
      component.setPsc(req);
      req.scheduleAppt = false;
      expect(component._psc).toEqual(req);
      expect(component.setScheduleAppt).not.toHaveBeenCalled();
    });
    it('setScheduleAppt have to be called 1 time', () => {
      const req = new PscLocationAvailability();
      spyOn(component,'setScheduleAppt').and.callThrough();
      dataService.locationFlowWithScheduleApp = false;
      component.setPsc(req);
      req.scheduleAppt = false;
      expect(component._psc).toEqual(req);
      expect(component.setScheduleAppt).toHaveBeenCalledTimes(1);
    });
  });

  describe('#sitecode', () => {
    it('call getEnableSiteCode', () => {
      spyOn(pscDetailsService, 'getEnableSiteCode').and.callThrough();
      component.ngOnInit();
      expect(pscDetailsService.getEnableSiteCode).toHaveBeenCalled();
    });
    it('show site code', () => {
      component.findLocationFlow = false;
      component.showSiteCode$ = of(true);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#sitecode').length).toBeGreaterThanOrEqual(1);
    });
    it('hide site code', () => {
      component.findLocationFlow = false;
      component.showSiteCode$ = of(false);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#sitecode').length).toBeLessThanOrEqual(0);
    });
  });
  describe('set active', () => {
    it('should set active variable with value undefined', () => {
      component.active = new PscLocationAvailability();
      expect(component._active).toEqual(new PscLocationAvailability());
    });
  });
  describe('set existingAppt', () => {
    it('should set existingAppt variable with value undefined', () => {
      component.existingAppt = '';
      expect(component.existingApptTime).toBeNull();
    });
  });
  describe('#goToOtherWebsite', () => {
    it('should call', () => {
      spyOn(component,'goToOtherWebsite').and.callThrough();
      component.goToOtherWebsite();
      expect(component.goToOtherWebsite).toHaveBeenCalled();
    });
  });
});
