import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsConfirmationBannerComponent } from './as-confirmation-banner.component';


describe('AsConfirmationBannerComponent', () => {
  let component: AsConfirmationBannerComponent;
  let fixture: ComponentFixture<AsConfirmationBannerComponent>;
  let propertyService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsConfirmationBannerComponent ],
      providers: [
        { provide: PropertiesService, useClass: MockPropertiesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsConfirmationBannerComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertiesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
