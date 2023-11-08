import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsCovid19DialogComponent } from './as-covid19-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsCovid19DialogComponent', () => {
  let component: AsCovid19DialogComponent;
  let fixture: ComponentFixture<AsCovid19DialogComponent>;
  let dialog: MatDialog;
  let spy: jasmine.Spy;
  let router: Router;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule,BrowserAnimationsModule,MatDialogModule],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: mockMatDialogRef},{ provide: PropertiesService, useClass: MockPropertiesService },
      ],
      declarations: [ AsCovid19DialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    propertiesService = TestBed.inject(PropertiesService);
    fixture = TestBed.createComponent(AsCovid19DialogComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.closeDialog();
    });
  });

  describe('#openCovidDetailsDialog', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.openCovidDetailsDialog();
    });
  });

  describe('#openCovidConfirmDialog', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.openCovidConfirmDialog();
    });
  });

});
