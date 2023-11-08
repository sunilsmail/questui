import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './as-eorder-sec-ins-container.component.html',
})
export class AsEorderSecInsContainerComponent implements OnInit {

  f1687 = null;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.f1687 = this.route.snapshot.data.f1687;
    }
  }

}
