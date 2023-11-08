import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from 'shared/services/route.service';

@Component({
  selector: 'as-footer',
  templateUrl: './as-footer.component.html',
  styleUrls: ['./as-footer.component.scss'],
})
export class AsFooterComponent implements OnInit, OnChanges {
  continue_btn_text = 'Continue';
  @Input() next: string;
  @Input() previous: string;
  @Input() enableContinue: boolean;
  @Input() reqParams: any;
  @Output() continue = new EventEmitter();
  @Input() highLightContinue = false;
  @Input() isSecondaryNotSelected = true;
  @Input() finalStep = false;
  constructor(private route: Router, private routeService: RouteService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.finalStep) {
      this.continue_btn_text = 'Review details';
    } else {
      this.continue_btn_text = 'Continue';
    }
}

  goToPreviousPage() {
    if (this.previous.includes('?')) {
      this.route.navigateByUrl(this.previous);
    } else {
      this.reqParams ? this.route.navigate([this.previous, this.reqParams]) : this.route.navigate([this.previous]);
    }
  }

  goToNext() {
    this.continue.emit();
    if (this.next) {
      this.route.navigate([this.next]);
    }
  }
}
