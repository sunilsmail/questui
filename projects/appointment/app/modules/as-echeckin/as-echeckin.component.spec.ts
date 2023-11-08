import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiService } from 'shared/services/api.service';
import { EcheckinDataService } from 'shared/services/echeckin/echeckin-data.service';
import { EcheckinService } from 'shared/services/echeckin/echeckin.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { AsEcheckinComponent } from './as-echeckin.component';

class MockRouteComponent { }
const routes = [
  { path: 'echeckin/as-echeckin-order-expiry', component: MockRouteComponent },
  { path: 'echeckin/as-echeckin-personal-information', component: MockRouteComponent }
];
describe('AsEcheckinComponent', () => {
  let component: AsEcheckinComponent;
  let fixture: ComponentFixture<AsEcheckinComponent>;
  let echeckinService: EcheckinService;
  let echeckinDataService: EcheckinDataService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsEcheckinComponent ],
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
      providers: [ EcheckinService, EcheckinDataService,
        { provide: ApiService, useClass: MockApiService },
        {provide: ActivatedRoute, useValue: {queryParams: of({ token: 'xxxxx' })}}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    echeckinService = TestBed.inject(EcheckinService);
    echeckinDataService = TestBed.inject(EcheckinDataService);
    fixture = TestBed.createComponent(AsEcheckinComponent);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should call getEncounterInfo', () => {
    component.ngOnInit();
    spyOn(echeckinService, 'getEncounterInfo').and.callThrough();
    echeckinService.getEncounterInfo('xxxxx').subscribe( data => {
     if(data && data.message && data.message === 'The SMS link has been expired') {
      expect(router.navigate).toHaveBeenCalledWith(['/echeckin/as-echeckin-order-expiry']);
     } else {
      expect(router.navigate).toHaveBeenCalledWith(['/echeckin/as-echeckin-personal-information']);
     }
    });
});
});
