import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogoutService } from 'shared/services/logout.service';
import { MockLogoutService } from 'shared/specs/mocks/mock-logout.service';
import { AsSessionTimoutPopupComponent } from './as-session-timout-popup.component';


const mockMatDialogData = 'anything';
const mockMatDialogRef = {
  close: () => {}
};

describe('AsSessionTimoutPopupComponent', () => {
  let component: AsSessionTimoutPopupComponent;
  let fixture: ComponentFixture<AsSessionTimoutPopupComponent>;
  let logoutService: LogoutService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AsSessionTimoutPopupComponent],
        providers: [
          { provide: MatDialogRef, useValue: mockMatDialogRef },
          { provide: LogoutService, useClass: MockLogoutService },
          { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AsSessionTimoutPopupComponent);
    component = fixture.componentInstance;
    logoutService = TestBed.inject(LogoutService);
    spyOn(logoutService, 'logout').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
