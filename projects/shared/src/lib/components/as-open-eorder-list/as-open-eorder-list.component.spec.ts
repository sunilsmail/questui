import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { openOrdersApiResponse } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { AsOpenEorderListComponent } from './as-open-eorder-list.component';

describe('AsOpenEorderListComponent', () => {
  let component: AsOpenEorderListComponent;
  let fixture: ComponentFixture<AsOpenEorderListComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FlexLayoutModule, RouterTestingModule, MockI18nModule,],
      declarations: [AsOpenEorderListComponent],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsOpenEorderListComponent);
    component = fixture.componentInstance;
    component.openEorders = openOrdersApiResponse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onItemSelected', () => {
    beforeEach(() => {

    });
    it('selecting an open eorder', () => {
      component.selectedItem = null;
      spyOn(component.selectedEorder, 'emit');
      component.onItemSelected(openOrdersApiResponse[0]);
      expect(component.selectedEorder.emit).toHaveBeenCalledWith(openOrdersApiResponse[0]);
    });
    it('selecting another eorder', () => {
      component.selectedItem = openOrdersApiResponse[0];
      spyOn(component.selectedEorder, 'emit');
      component.onItemSelected(openOrdersApiResponse[1]);
      expect(component.selectedEorder.emit).toHaveBeenCalledWith(openOrdersApiResponse[1]);
    });
    it('unselecting an open eorder', () => {
      component.selectedItem = openOrdersApiResponse[0];
      spyOn(component.selectedEorder, 'emit');
      component.onItemSelected(openOrdersApiResponse[0]);
      expect(component.selectedEorder.emit).toHaveBeenCalledWith(null);
    });
  });
});
