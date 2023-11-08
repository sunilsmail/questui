import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { TermsAndConditions } from 'shared/models';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'as-terms-and-conditions',
  templateUrl: './as-terms-and-conditions.component.html',
  styleUrls: ['./as-terms-and-conditions.component.scss']
})
export class AsTermsAndConditionsComponent implements OnInit {
  isHTML: boolean;
  content: string;
  @Output() termsNCo = new EventEmitter();

  TermsNCo: TermsAndConditions;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.TermsNCo = new TermsAndConditions();
    this.TermsNCo.termsText = '';
    this.getTNC();

  }
  getTNC(): void {
    this.userService.getTermsAndConditions().subscribe(TermsNCo => {
      this.TermsNCo = TermsNCo;
      this.termsNCo.emit(this.TermsNCo);
    });
  }
}
