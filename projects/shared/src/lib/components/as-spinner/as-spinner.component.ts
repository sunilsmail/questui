import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'as-spinner',
  templateUrl: './as-spinner.component.html',
  styleUrls: ['./as-spinner.component.scss']
})
export class AsSpinnerComponent implements OnInit {
  @Input() size: 'small' | 'medium' | 'large' = 'large';

  constructor() {}

  ngOnInit() {}

  getDiameter() {
    return this.size === 'small' ? 25 : this.size === 'medium' ? 50 : 100;
  }

  getStrokeWidth() {
    return this.size === 'small' ? 2.5 : this.size === 'medium' ? 5 : 10;
  }

}
