import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-price-estimate-dialog',
  templateUrl: './as-price-estimate-dialog.component.html',
  styleUrls: ['./as-price-estimate-dialog.component.scss']
})
export class AsPriceEstimateDialogComponent implements OnInit {
  content = homeContent;
  constructor(
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<AsPriceEstimateDialogComponent>,) {
    this.renderer.addClass(document.body, 'modal--price-estimate');
   }

  ngOnInit() {
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
