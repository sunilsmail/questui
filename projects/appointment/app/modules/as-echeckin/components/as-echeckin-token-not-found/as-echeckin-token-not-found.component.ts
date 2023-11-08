import { Component, OnInit } from '@angular/core';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-echeckin-token-not-found',
  templateUrl: './as-echeckin-token-not-found.component.html',
  styleUrls: ['./as-echeckin-token-not-found.component.scss']
})
export class AsEcheckinTokenNotFoundComponent implements OnInit {
  content = homeContent;

  constructor() {
  }

  ngOnInit() {
  }
  onRefresh(){
    window.location.reload();
  }
}

