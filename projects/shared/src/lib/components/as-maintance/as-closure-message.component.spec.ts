import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintainService } from 'shared/services/maintenace.service';
import { MockMiantainService } from 'shared/specs/mocks/mock-maintain.service';
import { AsClosureMessageComponent } from './as-closure-message.component';

describe('AsClosureMessageComponent', () => {
  let component: AsClosureMessageComponent;
  let fixture: ComponentFixture<AsClosureMessageComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsClosureMessageComponent], providers: [
        { provide: MaintainService, useClass: MockMiantainService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsClosureMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
