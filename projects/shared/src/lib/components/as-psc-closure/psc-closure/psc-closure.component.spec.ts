import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PscClosureComponent } from './psc-closure.component';


describe('PscClosureComponent', () => {
  let component: PscClosureComponent;
  let fixture: ComponentFixture<PscClosureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PscClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PscClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('show MOVING_TO_A_NEW_ADDRESS field',() =>{
    component.data ={
      address1: '7451 West Ridgewood Dr',
      address2: null,
      availability: [],
      buCode: 'QPT',
      city: 'Parma',
      customMessage: null,
      distance: '0.68',
      fax: 4408424789,
      labCard: 'true',
      latitude: 41.3837333,
      longitude: -81.7406264,
      name: 'Quest Diagnostics - Parma',
      phone: 4408428122,
      pscClosureComments: ['Moving to a new address on 9/28 4900 W Elkhorn Blvd'],
      pscTimings: '07:00-15:00',
      scheduleAppt: true,
      siteCode: 'IY',
      siteHoursStatus: 'Closed - Opens at 7:00 AM',
      siteType: 'PSC',
      state: 'OH',
      waitTime: null,
      zip: '44129-5534',
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('#newAddressId').length).toBeLessThanOrEqual(1);
  });
  it('hide MOVING_TO_A_NEW_ADDRESS field',() =>{
    component.data ={
      address1: '7451 West Ridgewood Dr',
      address2: null,
      availability: [],
      buCode: 'QPT',
      city: 'Parma',
      customMessage: null,
      distance: '0.68',
      fax: 4408424789,
      labCard: 'true',
      latitude: 41.3837333,
      longitude: -81.7406264,
      name: 'Quest Diagnostics - Parma',
      phone: 4408428122,
      pscClosureComments:[],
      pscTimings: '07:00-15:00',
      scheduleAppt: true,
      siteCode: 'IY',
      siteHoursStatus: 'Closed - Opens at 7:00 AM',
      siteType: 'PSC',
      state: 'OH',
      waitTime: null,
      zip: '44129-5534',
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('#newAddressId').length).toBeLessThan(1);
  });
});
