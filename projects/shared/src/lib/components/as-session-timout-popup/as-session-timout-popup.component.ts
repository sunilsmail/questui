import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogoutService } from 'shared/services/logout.service';

@Component({
  selector: 'as-session-timout-popup',
  templateUrl: './as-session-timout-popup.component.html',
  styleUrls: ['./as-session-timout-popup.component.scss']
})
export class AsSessionTimoutPopupComponent implements OnInit, OnDestroy {
  isSignInFlow = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AsSessionTimoutPopupComponent>,
    private renderer: Renderer2,
    private logoutService: LogoutService) {
      this.renderer.addClass(document.body, 'session-popup');
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'session-popup');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'session-popup');
  }

  closePopUp() {
    this.dialogRef.close();
  }
  redirectToHome() {
    this.logoutService.logout();
   // window.location.href = `${window.location.origin}/as-home`;
  }
}
