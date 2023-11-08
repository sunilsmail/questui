import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsCovid19DetailsDialogComponent } from './as-covid19-details-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsCovid19DetailsDialogComponent', () => {
  let component: AsCovid19DetailsDialogComponent;
  let fixture: ComponentFixture<AsCovid19DetailsDialogComponent>;
  let dialog: MatDialog;
  let spy: jasmine.Spy;
  let router: Router;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule,BrowserAnimationsModule,MatDialogModule],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: mockMatDialogRef},
        { provide: PropertiesService, useClass: MockPropertiesService }],
      declarations: [ AsCovid19DetailsDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsCovid19DetailsDialogComponent);
    dialog = TestBed.inject(MatDialog);
    propertiesService = TestBed.inject(PropertiesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(propertiesService, 'getQuestCovidDialogLink').and.callThrough();
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

  describe('#getStareted', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.closeDialog();
    });
  });
  describe('#onInit', () => {
    it('should call getCITUpdatedLinksFeatureFlag1421', () => {
      spyOn(propertiesService, 'getCITUpdatedLinksFeatureFlag1421').and.callThrough();
      component.ngOnInit();
      propertiesService.getCITUpdatedLinksFeatureFlag1421().subscribe( value => {
        expect(propertiesService.getCITUpdatedLinksFeatureFlag1421).toHaveBeenCalled();
      });
    });
  });
});
