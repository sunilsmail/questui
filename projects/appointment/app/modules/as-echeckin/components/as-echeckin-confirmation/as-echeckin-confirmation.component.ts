import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-echeckin-confirmation',
  templateUrl: './as-echeckin-confirmation.component.html',
  styleUrls: ['./as-echeckin-confirmation.component.scss']
})
export class AsEcheckinConfirmationComponent implements OnInit {
  content = homeContent;
  legacyCreateAccountLink: string;

  constructor(private propertiesService: PropertiesService,
              private router: Router) { }
  ngOnInit() {
    this.getCreateAccountLink();
  }

  getCreateAccountLink() {
    this.propertiesService.getLegacyCreateAccountLink().subscribe((url: string) => {
      this.legacyCreateAccountLink = url;
    });
  }

onCreateAccount() {
  window.location.href = this.legacyCreateAccountLink;
}
}

