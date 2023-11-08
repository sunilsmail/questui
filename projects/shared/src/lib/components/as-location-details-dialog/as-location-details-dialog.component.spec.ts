import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { AsViewLocationDetailsComponent } from '../as-view-location-details/as-view-location-details.component';
import { AsLocationDetailsDialogComponent } from './as-location-details-dialog.component';


describe('AsLocationDetailsDialogComponent', () => {
  let component: AsLocationDetailsDialogComponent;
  let fixture: ComponentFixture<AsLocationDetailsDialogComponent>;
  const mockMatDialogRef = {
    updateSize: (size: string) => { },
    close: () => { }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MockI18nModule,
        ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AsLocationDetailsDialogComponent,
        AsViewLocationDetailsComponent
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: mockMatDialogRef }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsLocationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#closeViewLocationDetails', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close');
    });
    it('closeViewLocationDetails', () => {
      component.closeViewLocationDetails();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
