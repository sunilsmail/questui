import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsRecaptchaComponent } from './as-recaptcha.component';


describe('AsRecaptchaComponent', () => {
  let component: AsRecaptchaComponent;
  let fixture: ComponentFixture<AsRecaptchaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsRecaptchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsRecaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
