import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'shared/services/data.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { AsActiveInfectionSymptomsComponent } from './as-active-infection-symptoms.component';


describe('AsActiveInfectionSymptomsComponent', () => {
  let component: AsActiveInfectionSymptomsComponent;
  let fixture: ComponentFixture<AsActiveInfectionSymptomsComponent>;
  let dataService: DataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [ AsActiveInfectionSymptomsComponent ],
      providers:[ { provide: DataService, useClass: MockDataService },],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsActiveInfectionSymptomsComponent);
    dataService = TestBed.inject(DataService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
