import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsEcheckinOrderExpiryComponent } from './as-echeckin-order-expiry.component';


describe('AsEcheckinOrderExpiryComponent', () => {
  let component: AsEcheckinOrderExpiryComponent;
  let fixture: ComponentFixture<AsEcheckinOrderExpiryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsEcheckinOrderExpiryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEcheckinOrderExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
