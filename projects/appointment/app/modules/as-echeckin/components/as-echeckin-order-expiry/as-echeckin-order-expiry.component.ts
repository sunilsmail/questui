import { Component, OnInit } from '@angular/core';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-echeckin-order-expiry',
  templateUrl: './as-echeckin-order-expiry.component.html',
  styleUrls: ['./as-echeckin-order-expiry.component.scss']
})
export class AsEcheckinOrderExpiryComponent implements OnInit {
  content = homeContent;

  constructor() {
  }

  ngOnInit() {
  }
}
