import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DropdownOption } from 'shared/models';

@Injectable({
  providedIn: 'root'
})
export class I18nConstantsService {
  states: DropdownOption[] = [
    { label: this.i18n('Alabama'), value: 'AL' },
    { label: this.i18n('Alaska'), value: 'AK' },
    { label: this.i18n('Arizona'), value: 'AZ' },
    { label: this.i18n('Arkansas'), value: 'AR' },
    { label: this.i18n('California'), value: 'CA' },
    { label: this.i18n('Colorado'), value: 'CO' },
    { label: this.i18n('Connecticut'), value: 'CT' },
    { label: this.i18n('Delaware'), value: 'DE' },
    { label: this.i18n('District Of Columbia'), value: 'DC' },
    { label: this.i18n('Florida'), value: 'FL' },
    { label: this.i18n('Georgia'), value: 'GA' },
    { label: this.i18n('Hawaii'), value: 'HI' },
    { label: this.i18n('Idaho'), value: 'ID' },
    { label: this.i18n('Illinois'), value: 'IL' },
    { label: this.i18n('Indiana'), value: 'IN' },
    { label: this.i18n('Iowa'), value: 'IA' },
    { label: this.i18n('Kansas'), value: 'KS' },
    { label: this.i18n('Kentucky'), value: 'KY' },
    { label: this.i18n('Louisiana'), value: 'LA' },
    { label: this.i18n('Maine'), value: 'ME' },
    { label: this.i18n('Maryland'), value: 'MD' },
    { label: this.i18n('Massachusetts'), value: 'MA' },
    { label: this.i18n('Michigan'), value: 'MI' },
    { label: this.i18n('Minnesota'), value: 'MN' },
    { label: this.i18n('Mississippi'), value: 'MS' },
    { label: this.i18n('Missouri'), value: 'MO' },
    { label: this.i18n('Montana'), value: 'MT' },
    { label: this.i18n('Nebraska'), value: 'NE' },
    { label: this.i18n('Nevada'), value: 'NV' },
    { label: this.i18n('New Hampshire'), value: 'NH' },
    { label: this.i18n('New Jersey'), value: 'NJ' },
    { label: this.i18n('New Mexico'), value: 'NM' },
    { label: this.i18n('New York'), value: 'NY' },
    { label: this.i18n('North Carolina'), value: 'NC' },
    { label: this.i18n('North Dakota'), value: 'ND' },
    { label: this.i18n('Ohio'), value: 'OH' },
    { label: this.i18n('Oklahoma'), value: 'OK' },
    { label: this.i18n('Oregon'), value: 'OR' },
    { label: this.i18n('Pennsylvania'), value: 'PA' },
    { label: this.i18n('Rhode Island'), value: 'RI' },
    { label: this.i18n('South Carolina'), value: 'SC' },
    { label: this.i18n('South Dakota'), value: 'SD' },
    { label: this.i18n('Tennessee'), value: 'TN' },
    { label: this.i18n('Texas'), value: 'TX' },
    { label: this.i18n('Utah'), value: 'UT' },
    { label: this.i18n('Vermont'), value: 'VT' },
    { label: this.i18n('Virginia'), value: 'VA' },
    { label: this.i18n('Washington'), value: 'WA' },
    { label: this.i18n('West Virginia'), value: 'WV' },
    { label: this.i18n('Wisconsin'), value: 'WI' },
    { label: this.i18n('Wyoming'), value: 'WY' },
    { label: this.i18n('Puerto Rico'), value: 'PR' }
  ];

  constructor(private i18n: I18n) { }
}
