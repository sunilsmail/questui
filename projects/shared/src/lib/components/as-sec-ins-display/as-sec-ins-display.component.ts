import { Component, Input } from '@angular/core';
import { SecondaryInsuranceData } from 'shared/models';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-sec-ins-display',
  templateUrl: './as-sec-ins-display.component.html',
  styleUrls: ['./as-sec-ins-display.component.scss']
})
export class AsSecInsDisplayComponent {
  @Input() insuranceData: SecondaryInsuranceData;
  @Input() screenName: string;
  // private _validIns: boolean;
  content = homeContent;
  constructor() {
  }

  // public get validIns() {
  //   if (this.insuranceData && this.insuranceData.provider && (typeof this.insuranceData.provider === 'string')) {
  //     return true;
  //   }
  //   return false;
  // }

}
