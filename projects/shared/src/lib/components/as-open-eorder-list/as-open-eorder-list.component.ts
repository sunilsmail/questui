import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { OpenEorders } from './../../models/eorder-expiry-status';



@Component({
  selector: 'as-open-eorder-list',
  templateUrl: './as-open-eorder-list.component.html',
  styleUrls: ['./as-open-eorder-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AsOpenEorderListComponent implements OnInit, AfterViewInit {
  @Input() openEorders: OpenEorders[];
  @Output() selectedEorder: EventEmitter<OpenEorders> = new EventEmitter();
  @Input() selectedItem: OpenEorders = null;
  lastOptiontext = null;

  constructor(private i18n: I18n) {
  }
  ngAfterViewInit(): void {
    this.highlightFocus();
  }

  ngOnInit() {
    this.lastOptiontext = this.i18n('Schedule for something else');
  }

  onItemSelected(item: OpenEorders): void {
    if (!this.selectedItem) {
      this.selectedItem = item;
    }
    else if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
    this.selectedEorder.emit(this.selectedItem);
  }

  highlightFocus() {
    if (this.selectedItem && this.openEorders.length > 0) {
      const index = this.openEorders.findIndex(item => item.token === this.selectedItem.token);
      setTimeout(() => {
        if (document.getElementById(`card-${index}`)) {
          document.getElementById(`card-${index}`).focus();
        }
      }, 100);
    }
  }

  onkeyDownButton(event: KeyboardEvent, id: number) {
    const controls = document.getElementById(`card_${id}`);
    if (controls) {
      controls.focus();
    }
  }

}
