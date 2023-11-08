import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PropertiesService } from 'shared/services/properties.service';
import { ForgotConfirmationCodeService } from '../../../../../../shared/src/lib/services/forgot-confcode.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  templateUrl: './as-forgot-confcode-success-dialog.component.html',
  styleUrls: ['./as-forgot-confcode-success-dialog.component.scss']
})
export class AsForgotConfirmationCodeSuccessDialogComponent implements OnDestroy, OnInit {
  content = homeContent;
  public clicks = new Subject();
  private subscription: Subscription;
  timeDelay = 5000;
  resent = false;
  constructor(
    public dialogRef: MatDialogRef<AsForgotConfirmationCodeSuccessDialogComponent>,
    public forgotConfirmationCodeService: ForgotConfirmationCodeService,
    private renderer: Renderer2,
    private propertiesService: PropertiesService
  ) {
    this.renderer.addClass(document.body, 'modal-verify-phone');
  }

  ngOnInit() {
    this.propertiesService.getResendConfCodeTimeDelay().subscribe((val)=>{
      this.timeDelay = +val;
    });
    this.subscription = this.clicks.pipe(debounceTime(this.timeDelay)).subscribe(e => this.resendConfimationCode());
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-verify-phone');
    this.subscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  resendConfimationCode() {
    this.forgotConfirmationCodeService.resendConfimationCode().subscribe();
    this.resent = true;
    setTimeout(() => {
      this.resent= false;
    }, 500);
  }
  onNeverMind() {
    this.dialogRef.close();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    if (event.target && event.target.id && (event.target.id === 'btnResend' || event.target.id === 'lblResend')) {
      event.preventDefault();
      event.stopPropagation();
      this.clicks.next(event);
    }
  }
}
