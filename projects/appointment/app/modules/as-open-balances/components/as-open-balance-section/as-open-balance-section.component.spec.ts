import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { SearchARResponse } from 'shared/models/open-balance';
import { OpenBalanceService } from 'shared/services/open-balance/open-balance.service';
import { MockOpenBalanceService } from 'shared/specs/mocks/mock-open-balance.service';
import { AsOpenBalanceSectionComponent } from './as-open-balance-section.component';

describe('AsOpenBalanceSectionComponent', () => {
  let component: AsOpenBalanceSectionComponent;
  let fixture: ComponentFixture<AsOpenBalanceSectionComponent>;
  let openBalanceService: OpenBalanceService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsOpenBalanceSectionComponent],
      imports: [CustomPipesModule,
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [
        { provide: openBalanceService, useClass: MockOpenBalanceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsOpenBalanceSectionComponent);
    openBalanceService = TestBed.inject(OpenBalanceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getOBResponse', () => {
    it('should get open Balance response', () => {
      spyOn(openBalanceService, 'getOBResponse').and.callThrough();
    });
  });

  // describe('#getTitleBalance', () => {

  //   it('should has title as We noticed you have a past due balance for previous testing', () => {
  //     expect(component.title).toEqual('We noticed you have a past due balance for previous testing')
  //   });
  // });

});
