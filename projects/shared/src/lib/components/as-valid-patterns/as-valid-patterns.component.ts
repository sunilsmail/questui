import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InsuranceError, Pattern } from 'shared/models';

@Component({
  selector: 'as-valid-patterns',
  templateUrl: './as-valid-patterns.component.html',
  styleUrls: ['./as-valid-patterns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsValidPatternsComponent {

  @Input() validPatterns: Pattern[] = [];
  @Input() showOtherFields: boolean;
  @Input() type: string;
  @Output() resetError = new EventEmitter();
  errorType = InsuranceError;
  constructor() { }
  reset() {
    this.resetError.emit();
  }

}
