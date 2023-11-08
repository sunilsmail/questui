import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PrintData } from 'shared/models/print-data';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { default as homeContent } from '../../../../../assets/content.json';


@Component({
  selector: 'as-confirmation-print',
  templateUrl: './as-confirmation-print.component.html',
  styleUrls: ['./as-confirmation-print.component.scss']
})
export class AsConfirmationPrintComponent implements OnInit, OnDestroy, OnChanges {
  @Input() inputEvent: PrintData;
  facilityTestTypeValue: any;
  content = homeContent;
  destroy$ = new Subject<void>();
  printDetailsData:any;
  eorder = false;
  constructor(private dataService: EorderDataService) { }

  ngOnChanges(): void {
    this.printDetailsData = this.inputEvent;
  }

  ngOnInit() {
    this.printDetailsData = this.inputEvent;
    if(this.dataService.isEorderFLow){
     this.eorder = true;
    }
  }

  /* printConfirmation() {
    setTimeout(() => {
          window.print();
    });
  } */

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
