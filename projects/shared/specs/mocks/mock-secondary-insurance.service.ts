import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { InsuranceData } from 'shared/models';
import { regex } from 'shared/utils/validation/regex-patterns';
export class MockSecondaryInsuranceService {

  setInsuranceData(data: InsuranceData) {
  }

  getInsuranceData(): Observable<InsuranceData> {
    return of(new InsuranceData());
  }
  addGtrControls(form: FormGroup) {
    form.addControl('address1', new FormControl('',
      [Validators.minLength(3), Validators.maxLength(75), Validators.pattern(regex.address1), Validators.required]));
    form.addControl('address2', new FormControl('',
      [Validators.minLength(1), Validators.maxLength(75), Validators.pattern(regex.address1)]));
    form.addControl('city', new FormControl('',
      [Validators.minLength(3), Validators.maxLength(30), Validators.pattern(regex.city), Validators.required]));
    form.addControl('state', new FormControl('',
      [Validators.required, Validators.pattern(regex.state)]));
    form.addControl('zipCode', new FormControl('',
      [Validators.minLength(5), Validators.maxLength(10), Validators.pattern(regex.zipCode), Validators.required]));
  }
  removeGtrControls(form: FormGroup) { }
}
