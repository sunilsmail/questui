import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';

import { AsCtNeedMoreInfoDialogComponent } from './as-ct-need-more-info-dialog.component';

describe('AsCtNeedMoreInfoDialogComponent', () => {
  let component: AsCtNeedMoreInfoDialogComponent;
  let fixture: ComponentFixture<AsCtNeedMoreInfoDialogComponent>;
  let propertiesService: PropertiesService;

  const mockMatDialogRef = {
    close: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      declarations: [ AsCtNeedMoreInfoDialogComponent ],
      providers: [{ provide: PropertiesService, useClass: MockPropertiesService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    propertiesService = TestBed.inject(PropertiesService);
    fixture = TestBed.createComponent(AsCtNeedMoreInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onInit', () => {
    beforeEach(() => {
      spyOn(propertiesService, 'getCtcConnectUrl');
    });
    it('getClinicalTrails Link', () => {
      component.ngOnInit();
      expect(propertiesService.getCtcConnectUrl).toHaveBeenCalled();
    });
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close');
    });
    it('closeDialog', () => {
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
