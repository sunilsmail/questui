import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AsActiveInfectionOrderDialogComponent } from './as-active-infection-order-dialog.component';

const mockMatDialogRef = {
    updateSize: (size: string) => {},
    close: () => {}
  };

describe('AsActiveInfectionOrderDialogComponent', () => {
  let component: AsActiveInfectionOrderDialogComponent;
  let fixture: ComponentFixture<AsActiveInfectionOrderDialogComponent>;
  let spy: jasmine.Spy;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule],
        providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
          {provide: MatDialogRef, useValue: mockMatDialogRef}],
        declarations: [ AsActiveInfectionOrderDialogComponent ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsActiveInfectionOrderDialogComponent);
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
});
