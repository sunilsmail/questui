import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AsSpinnerComponent } from './as-spinner.component';


describe('AsSpinnerComponent', () => {
  let component: AsSpinnerComponent;
  let fixture: ComponentFixture<AsSpinnerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AsSpinnerComponent],
        imports: [FlexLayoutModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AsSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getDiameter', () => {
    it('should return small < medium < large', () => {
      const largeDiameter = component.getDiameter();
      component.size = 'medium';
      const mediumDiameter = component.getDiameter();
      component.size = 'small';
      const smallDiameter = component.getDiameter();
      expect(largeDiameter).toBeGreaterThan(mediumDiameter);
      expect(mediumDiameter).toBeGreaterThan(smallDiameter);
    });
  });

  describe('#getStrokeWidth', () => {
    it('should return small < medium < large', () => {
      const largeStrokeWidth = component.getStrokeWidth();
      component.size = 'medium';
      const mediumStrokeWidth = component.getStrokeWidth();
      component.size = 'small';
      const smallStrokeWidth = component.getStrokeWidth();
      expect(largeStrokeWidth).toBeGreaterThan(mediumStrokeWidth);
      expect(mediumStrokeWidth).toBeGreaterThan(smallStrokeWidth);
    });
  });
});
