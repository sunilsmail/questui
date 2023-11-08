import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcheckinDataService } from 'shared/services/echeckin/echeckin-data.service';
import { EcheckinService } from 'shared/services/echeckin/echeckin.service';

@Component({
  selector: 'as-echeckin',
  templateUrl: './as-echeckin.component.html',
  styleUrls: ['./as-echeckin.component.scss']
})
export class AsEcheckinComponent implements OnInit {
token: string;
loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private echeckinService: EcheckinService,
    private echeckinDataService: EcheckinDataService) {
    this.route.queryParams.subscribe(params => {
      if(params && params.token){
      this.token = params['token'];
      this.echeckinDataService.setToken(this.token);
      }
    });
   }
  ngOnInit() {
    if(this.token){
      this.echeckinService.getEncounterInfo(this.token).subscribe((data: any) => {
        this.loading = false;
        if(data && data.status === 204){
          this.echeckinDataService.setTokenNotFound(true);
          this.router.navigate(['/echeckin/as-echeckin-token-not-found']);
        }
        else if (data && data.message && data.message === 'The SMS link has been expired') {
          this.router.navigate(['/echeckin/as-echeckin-order-expiry']);
        } else {
          this.echeckinDataService.isEcheckinFLow = true;
          this.echeckinDataService.setEncounterInfo(data);
          this.router.navigate(['/echeckin/as-echeckin-personal-information']);
        }
      }, (error) => {
        // need to check for invalid and expired tokens
        this.loading = false;
        const response = error.data;
        if (error.status === 403) {
          this.router.navigate(['/echeckin/as-echeckin-token-not-found']);
        }
      });
    }
  }

}
