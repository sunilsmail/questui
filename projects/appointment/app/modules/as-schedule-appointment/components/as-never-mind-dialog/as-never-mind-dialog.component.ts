import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'as-never-mind-dialog',
  templateUrl: './as-never-mind-dialog.component.html',
  styleUrls: ['./as-never-mind-dialog.component.scss']
})
export class AsNeverMindDialogComponent implements OnInit, OnDestroy {
  isSignInFlow = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AsNeverMindDialogComponent>,
    private renderer: Renderer2) {
      dialogRef.disableClose = true;
      this.renderer.addClass(document.body, 'never-mind');
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'never-mind');
    document.getElementById('closebutton').focus();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'never-mind');
  }

  closePopUp() {
    this.dialogRef.close();
  }

  redirectToHome() {
    window.location.href = `${window.location.origin}/as-home`;
  }

}
