import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AsLocationUnavailableDialogComponent } from 'app/modules/as-find-location/components/as-location-unavailable-dialog/as-location-unavailable-dialog.component';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';

@Component({
  selector: 'as-reason-test-list',
  templateUrl: './as-reason-test-list.component.html',
  styleUrls: ['./as-reason-test-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AsReasonTestListComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @Input() listItems: ReasonCategory[];
  @Input() multiSelect: boolean;
  @Input() selectedTests: ReasonCategory[];
  @Input() selectedReason: ReasonCategory;
  @Input() invalidLocationIndex = -1;
  @Input() invalidLocationChildIndex = -1;

  @Output() itemSelected: EventEmitter<ReasonCategory> = new EventEmitter();
  height: string;
  Math = Math;
  imageSrc: SafeResourceUrl;
  istestAvailable: boolean;
  _focusHandler = this.clearFocus.bind(this);
  private _selectedItem: ReasonCategory;
  excludedId = [28, 29];

  constructor(private sanitizer: DomSanitizer,
    private router: Router,
    private dataService: DataService,
    private matDialog: MatDialog,) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
  }

  ngOnInit() {
    // this.excludedId.forEach((i) => {
    //   this.listItems.forEach(element => {
    //     if (element.facilityServiceId === i) {
    //       this.listItems.splice(this.listItems.findIndex((item) => item.facilityServiceId === i), 1);
    //     }
    //   });
    // });
   this.onButtonFocus();
  }

  ngAfterViewChecked() {
    this.listItems.map((el) => {
      el['expanded'] = false;
    });
  }

  ngAfterViewInit() {
    if (!navigator.userAgent.includes('Trident/')) {
      const elements = document.querySelectorAll('.clearFocus');
      for (let i = 0; i <= elements.length - 1; i++) {
        elements[i].addEventListener('focus', this._focusHandler);
      }
    }
  }

  onItemSelected(item: ReasonCategory, e): void {
    if (e.type === 'click' || e.keyCode === 13) {
      item.index = this.listItems.findIndex(x => x.facilityServiceId === item.facilityServiceId);
      this._selectedItem = item;
      this.itemSelected.emit(item);
      if (this.multiSelect) {
        this.onTestSelected(item);
      }
    }
  }
  onButtonFocus(){
    for (let i = 0; i < this.listItems.length; i++) {
      this.listItems[i].btnText=(this.listItems[i].facilityTestTypeValue).replace(/<[^>]*>/g, '');
    }
  }

  onTestSelected(selectedTest: ReasonCategory): void { }
  /* Accessibility defect fix start */
  onInfoClickedEsc(event, item) {
    if (event.key === 'Escape' || event.key === 'Esc' || event.key === 'ArrowDown' || event.keyCode === 40) {
      this.onCloseClicked(event, item);
    }
  }

  onInfoClickedCtrl(event, item) {
    event.preventDefault();
    this.onInfoClicked(event, item);
  }
  /* Accessibility defect fix end */

  onInfoClicked(event, item) {
    event.stopPropagation();
    this.height = '100%';
    item.expanded = true;
    if (!event.shiftKey) {
      setTimeout(() => {
        const ele = document.querySelector('.ds-icon--close');
        if (ele) {
          (ele as HTMLElement).focus();
        }
      });

      /** accessibility changes start */
      if (navigator.userAgent.includes('Trident/')) {
        event.target.parentElement.setAttribute('tabIndex', '0');
        event.target.parentElement.focus();
      }
    } else {
      event.target.closest('button').focus();
    }
    /** accessibility changes end */
  }

  onCloseClicked(event, item) {
    /** accessibility changes start */
    const element = event.currentTarget.parentElement;
    /** accessibility changes end */

    event.stopPropagation();
    item.expanded = false;

    /** accessibility changes start */
    if (navigator.userAgent.includes('Trident/')) {
      const ele = this.closestElement(event.target, '.ds-col--6');
      if (ele && ele.nextSibling) {
        ele.nextSibling.focus();
      } else {
        (document.querySelector('.ds-col--10') as HTMLElement).focus();
      }
    }
    if ((event.key === 'Escape' || event.key === 'Esc' || event.key === 'ArrowDown') && !navigator.userAgent.includes('Trident/')) {
      setTimeout(() => {
        element.children[1].classList.add('focus-element');
      }, 0);
    }
    /** accessibility changes end */
  }

  foundInTest(item) {
    if (this.selectedTests) {
      return this.selectedTests.findIndex(x => x.facilityServiceId === item.facilityServiceId) > -1;
    }
  }

  navigateToLocation(event) {
    // this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
    // this.dataService.setTestsData(this.selectedTests);
    this.dataService.isDeepLinkReasonServicesNotOffered ? this.router.navigate(['/schedule-appointment/as-appt-scheduler'])
      : this.router.navigate(['/find-location/as-location-finder']);
    event.stopPropagation();
  }

  public closestElement(el, selector) {
    let matchesFn;
    let parent;

    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (func) {
      if (typeof document.body[func] === 'function') {
        matchesFn = func;
        return true;
      }
      return false;
    });

    // traverse parents
    while (el) {
      parent = el.parentElement;
      if (parent && parent[matchesFn](selector)) {
        return parent;
      }
      el = parent;
    }

    return null;
  }
  clearFocus() {
    /** accessibility changes start */
    const elements = document.querySelector('.focus-element');
    if (elements) {
      elements.classList.remove('focus-element');
    }
    /** accessibility changes end */
  }

  showLocationNotAvailableDialog(show: boolean, event: any) {
    if (show) {
      this.matDialog.open(AsLocationUnavailableDialogComponent, {
        height: 'auto', maxWidth: '100vw', disableClose: true,
      }).afterClosed().subscribe((value) => {
        if (value) {
          this.navigateToLocation(event);
        }
      });
    }
  }

}
