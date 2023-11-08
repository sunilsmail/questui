import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'as-loading-container',
  templateUrl: './as-loading-container.component.html',
  styleUrls: ['./as-loading-container.component.scss']
})
export class AsLoadingContainerComponent implements OnDestroy, OnInit {
  @Input() asLoadingData: Observable<any> = new Observable<any>();
  @Input() asLoadErrorMessage: string;
  @Input() asNoDataMessage: string;
  @Input() asSpinnerSize: 'small' | 'medium' | 'large' = 'large';
  @Input() loadingMore: Observable<boolean>;
  @Input() morning: boolean;
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;
  private subscription: Subscription;
  data: any;
  currentState: 'loading' | 'loaded' | 'error' | 'empty' = 'loading';

  constructor(private i18n: I18n) {
    if (!this.asLoadErrorMessage) {
      this.asLoadErrorMessage = this.i18n('Failed to load data.');
    }
  }

  ngOnInit() {
    this.subscription = this.asLoadingData.subscribe(data => {
      this.data = data;
      if (!this.data) {
        this.currentState = 'empty';
      } else if (this.data instanceof Array && (this.data as Array<any>).length === 0) {
        this.currentState = 'empty';
      } else {
        this.currentState = 'loaded';
      }
    }, () => (this.currentState = 'error'));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
