import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-important-visit-info-dialog',
  templateUrl: './as-important-visit-info-dialog.component.html',
  styleUrls: ['./as-important-visit-info-dialog.component.scss']
})
export class AsImportantVisitInfoDialogComponent implements OnDestroy, OnInit {
  covidTestingOptions$: Observable<String>;
  content = homeContent;
  constructor(public dialogRef: MatDialogRef<AsImportantVisitInfoDialogComponent>,
    private renderer: Renderer2,
    private propertiesService: PropertiesService,
    private userService: UserService) {
    this.renderer.addClass(document.body, 'modal--imp-visit-info');
  }

  ngOnInit() {

    this.userService.isAuthenticated$.subscribe((isLoggedIn) => {
      if(isLoggedIn){
       // this.dialogRef.close();
      }
    });
    this.covidTestingOptions$ = this.propertiesService.getCovidTestingOptionsLink();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal--imp-visit-info');
  }

}
