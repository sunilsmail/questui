import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { pscs } from 'app/mocks/pscs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { UserService } from 'shared/services/user.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { AsPscDetailsComponent } from './as-psc-details.component';


describe('AsPscDetailsComponent', () => {
  let component: AsPscDetailsComponent;
  let fixture: ComponentFixture<AsPscDetailsComponent>;
  let pscService: PscService;
  let propertiesService: PropertiesService;
  let dataService: DataService;
  let userService: UserService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsPscDetailsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MockI18nModule, CustomPipesModule],
      providers: [
        { provide: PscService, useClass: MockPscService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: DataService, useClass: MockDataService },
        { provide: UserService, useClass: MockUserService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(AsPscDetailsComponent);
    pscService = TestBed.inject(PscService);
    propertiesService = TestBed.inject(PropertiesService);
    dataService = TestBed.inject(DataService);
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
    it('should emit morning slots', () => {
      component.pscMorningTime$.subscribe((morningSlots) => {
        expect(morningSlots).toContain({ time: '8:00', available: true });
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
});
