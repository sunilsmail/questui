import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { AsFooterComponent } from './as-footer.component';



describe('AsFooterComponent', () => {
  let component: AsFooterComponent;
  let fixture: ComponentFixture<AsFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsFooterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatIconModule, MatButtonModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#goToPreviousPage', () => {
    beforeEach(() => {
      it('if the current page is as-insurance-info page, user should be redirected to as-personal-info', () => {
        spyOn(component, 'goToPreviousPage');
        expect(component.previous).toEqual('as-personal-info');
      });
      it('if the current page is as-personal-info, then user should be redirected to as-apt-scheduler', () => {
        spyOn(component, 'goToPreviousPage');
        expect(component.previous).toEqual('as-apt-scheduler');
      });
      it('if the cuurent page is as-apt-scheduler, user should be redirected to  as-reason-for-visit', () => {
        spyOn(component, 'goToPreviousPage');
        expect(component.previous).toEqual('as-reason-for-visit');
      });
    });
  });
});
