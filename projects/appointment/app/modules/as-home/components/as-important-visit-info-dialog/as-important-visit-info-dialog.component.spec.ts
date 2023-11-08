import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';
import { mockUiProperties, MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { AsImportantVisitInfoDialogComponent } from './as-important-visit-info-dialog.component';

describe('AsImportantVisitInfoDialogComponent', () => {
  let component: AsImportantVisitInfoDialogComponent;
  let fixture: ComponentFixture<AsImportantVisitInfoDialogComponent>;
  let propertiesService: PropertiesService;
  let userService: UserService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsImportantVisitInfoDialogComponent ],
      providers: [ Renderer2,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: MatDialogRef, useValue: { close: () => {}} },
        { provide: UserService, useClass: MockUserService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsImportantVisitInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    propertiesService = TestBed.inject(PropertiesService);
    userService = TestBed.inject(UserService);
    spyOn(propertiesService, 'getCovidTestingOptionsLink').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get covidTestingOptions on ngOnInit method', () => {
    component.ngOnInit();
    expect(component.covidTestingOptions$).toBeTruthy();
     component.covidTestingOptions$.subscribe(uri => {
       expect(uri).toEqual(mockUiProperties.covidTestingOptions);
     });
    expect(propertiesService.getCovidTestingOptionsLink).toHaveBeenCalled();
  });
});
