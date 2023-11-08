import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-cancel-appointment-success-dialog',
  templateUrl: './as-cancel-appointment-success-dialog.component.html',
  styleUrls: ['./as-cancel-appointment-success-dialog.component.scss']
})
export class AsCancelAppointmentSuccessDialogComponent implements OnDestroy, OnInit {
  content = homeContent;

  constructor(public dialogRef: MatDialogRef<AsCancelAppointmentSuccessDialogComponent>,
    private router: Router, private renderer: Renderer2, private propertyService: PropertiesService,) {
    this.renderer.addClass(document.body, 'modal-cancel-appointment');
  }

  ngOnInit() {
  }

  onRescheduleAppointment() {
    // to fix : DE26940
    // this.router.navigate(['schedule-appointment/as-reason-for-visit']);
    console.log('onRescheduleAppointment');
    location.href = '/schedule-appointment/as-reason-for-visit';
    this.dialogRef.close();
  }
  closeCancelDialog(event) {
    if (event.key === 'Escape') {
      setTimeout(() => {
        location.href = '/schedule-appointment/as-reason-for-visit';
      }, 0);

      this.dialogRef.close();
      // this.router.navigate(['/as-home']);
    }
  }
  onClose() {
    this.dialogRef.close();
    location.href = '/as-home';
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-cancel-appointment');
  }
}
