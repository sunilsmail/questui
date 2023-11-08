import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { AsCovid19ElectronicCommonDialogComponent } from './as-covid19-electronic-common-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsCovid19ElectronicCommonDialogComponent', () => {
  let component: AsCovid19ElectronicCommonDialogComponent;
  let fixture: ComponentFixture<AsCovid19ElectronicCommonDialogComponent>;
  let dialog: MatDialog;
  let router: Router;
  let skipInsuranceService: SkipInsuranceService;
  let propertiesService: PropertiesService;
  let dataService: DataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule,BrowserAnimationsModule,MatDialogModule],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: SkipInsuranceService, useClass: MockSkipInsuranceService },
        { provide: DataService, useClass: MockDataService }],
      declarations: [ AsCovid19ElectronicCommonDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    propertiesService = TestBed.inject(PropertiesService);
    dataService = TestBed.inject(DataService);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
    fixture = TestBed.createComponent(AsCovid19ElectronicCommonDialogComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
