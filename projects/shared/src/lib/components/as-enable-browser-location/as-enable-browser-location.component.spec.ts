import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsEnableBrowserLocationComponent } from './as-enable-browser-location.component';


describe('AsEnableBrowserLocationComponent', () => {
  let component: AsEnableBrowserLocationComponent;
  let fixture: ComponentFixture<AsEnableBrowserLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsEnableBrowserLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEnableBrowserLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

/*   it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
