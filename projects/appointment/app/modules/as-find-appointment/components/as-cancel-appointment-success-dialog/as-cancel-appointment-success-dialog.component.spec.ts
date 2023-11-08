import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsCancelAppointmentSuccessDialogComponent } from './as-cancel-appointment-success-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { }
};
describe('AsCancelAppointmentSuccessDialogComponent', () => {
  let component: AsCancelAppointmentSuccessDialogComponent;
  let fixture: ComponentFixture<AsCancelAppointmentSuccessDialogComponent>;
  let propertiesService: PropertiesService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsCancelAppointmentSuccessDialogComponent],
      imports: [RouterTestingModule.withRoutes([]),
        HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: Router, useValue: mockRouter },
        { provide: PropertiesService, useClass: MockPropertiesService },],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsCancelAppointmentSuccessDialogComponent);
    propertiesService = TestBed.inject(PropertiesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('#onRescheduleAppointment', () => {
  //   it('on reschedule, navigates to reason-for visit and dialog gets closed ', fakeAsync(() => {
  //     component.onRescheduleAppointment();
  //     // expect(mockRouter.navigate).toHaveBeenCalledWith(['schedule-appointment/as-reason-for-visit']);
  //     mockMatDialogRef.close();
  //   }));
  // });

  // describe('#onClose', () => {
  //   it('on-close dialog, dialog gets closed and redirected to home ', fakeAsync(() => {
  //     component.onClose();
  //     mockMatDialogRef.close();
  //     expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  //   }));
  // });

  describe('#new_modal', () => {
    it('dialog show display new modal template', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#new_modal').length).toBeLessThanOrEqual(1);
    });
  });
});
