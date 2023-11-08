import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, Observable } from 'rxjs';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { AsLoadingContainerComponent } from './as-loading-container.component';


@Component({
  selector: 'as-mock-host-component',
  template: `
    <as-loading-container [asLoadingData]="observable$" asNoDataMessage="no data message" asSpinnerSize="medium">
      <ng-template let-data>
      </ng-template>
    </as-loading-container>
    `
})
class MockHostComponent {
  observable$ = new Observable<any>();
}

describe('AsLoadingContainerComponent', () => {
  let component: AsLoadingContainerComponent;
  let fixture: ComponentFixture<AsLoadingContainerComponent>;
  let hostFixture: ComponentFixture<MockHostComponent>;
  let hostComponent: MockHostComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AsLoadingContainerComponent, MockHostComponent],
        imports: [MockI18nModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    hostFixture = TestBed.createComponent(MockHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    fixture = TestBed.createComponent(AsLoadingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets data when observable is successful', () => {
    component.asLoadingData = of('test this');
    component.ngOnInit();
    expect(component.data).toEqual('test this');
  });

  describe('#currentState', () => {
    it('initializes to loading', () => {
      expect(component.currentState).toEqual('loading');
    });

    it('sets to empty when observable emits null', () => {
      component.asLoadingData = of(null);
      component.ngOnInit();
      expect(component.currentState).toEqual('empty');
    });

    it('sets to empty when observable emits an empty array', () => {
      component.asLoadingData = of([]);
      component.ngOnInit();
      expect(component.currentState).toEqual('empty');
    });

    it('sets to loaded when observable emits an object', () => {
      component.asLoadingData = of({ foo: 'bar' });
      component.ngOnInit();
      expect(component.currentState).toEqual('loaded');
    });

    it('sets to loaded when observable emits an array with values', () => {
      component.asLoadingData = of(['yes']);
      component.ngOnInit();
      expect(component.currentState).toEqual('loaded');
    });

    it('sets to error when observable errors', () => {
      component.asLoadingData = throwError('error');
      component.ngOnInit();
      expect(component.currentState).toEqual('error');
    });
  });
});
