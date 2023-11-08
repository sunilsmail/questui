import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';

@Component({
  selector: 'as-eorder-footer',
  templateUrl: './as-eorder-footer.component.html',
  styleUrls: ['./as-eorder-footer.component.scss']
})
export class AsEorderFooterComponent implements OnInit,OnChanges   {
  continue_btn_text = 'Continue';
  @Input() next: string;
  @Input() previous: string;
  @Input() enableContinue: boolean;
  @Input() reqParams: any;
  @Output() continue = new EventEmitter();
  @Input() highLightContinue = false;
  @Input() isVisiablePreviousURL = false;
  @Input() finalStep = false;
  @Input() enableEasypay = false;
  constructor(private route: Router,private eorderDataService: EorderDataService,private i18n: I18n) { }

  ngOnInit() {
  }
  ngOnChanges() {
    if(this.finalStep){
      // this.continue_btn_text = this.i18n('Show Summary').trim();
      this.continue_btn_text = this.i18n('Finish');
    }
  }
  goToPreviousPage() {
    this.eorderDataService.setPreviousUrlDemographic(true);
    this.reqParams ? this.route.navigate([this.previous, this.reqParams]) : this.route.navigate([this.previous]);
  }

  goToNext() {
    this.continue.emit();
    if (this.next) {
      this.route.navigate([this.next]);
    }
  }

  get getAriaLabel() {
    if(this.finalStep){
      return this.i18n('Finish');
      // return this.i18n('Show Summary').trim();
    } else {
      return this.i18n('Continue');
    }
  }
}
