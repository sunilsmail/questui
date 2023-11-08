import { Component, Input, OnInit } from '@angular/core';
import { PscLocationAvailability } from 'shared/models';

@Component({
  selector: 'psc-closure',
  templateUrl: './psc-closure.component.html',
  styleUrls: ['./psc-closure.component.scss']
})
export class PscClosureComponent implements OnInit {
  @Input() data: PscLocationAvailability;
  constructor() { }

  ngOnInit() {
  }

}
