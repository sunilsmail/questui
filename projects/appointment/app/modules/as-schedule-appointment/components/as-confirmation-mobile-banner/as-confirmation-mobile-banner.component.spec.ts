import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsConfirmationMobileBannerComponent } from './as-confirmation-mobile-banner.component';


describe('AsConfirmationMobileBannerComponent', () => {
  let component: AsConfirmationMobileBannerComponent;
  let fixture: ComponentFixture<AsConfirmationMobileBannerComponent>;
  let propertyService: PropertiesService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsConfirmationMobileBannerComponent ],
      providers: [
        { provide: PropertiesService, useClass: MockPropertiesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsConfirmationMobileBannerComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertiesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
