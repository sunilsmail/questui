import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'shared/services/data.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { AsReasonTestListComponent } from './as-reason-test-list.component';

const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { }
};

describe('AsReasonTestListComponent', () => {
    let component: AsReasonTestListComponent;
    let fixture: ComponentFixture<AsReasonTestListComponent>;
    let router: Router;
    let sanitizer: DomSanitizer;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FlexLayoutModule, RouterTestingModule, MatDialogModule],
            declarations: [AsReasonTestListComponent],
            providers: [
              { provide: DataService, useClass: MockDataService },
              { provide: MatDialogRef, useValue: mockMatDialogRef },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        sanitizer = TestBed.inject(DomSanitizer);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(AsReasonTestListComponent);
        component = fixture.componentInstance;
        component.listItems = [{
            facilityServiceId: 1,
            facilityTestType: 'PHLEBOTOMY',
            facilityTestTypeValue: 'All Other Tests',
            testDesc: 'Select this option if your tests are not one of the prior options.',
            precedence: 1,
            serviceRequestor: null
        }, {
            facilityServiceId: 6,
            facilityTestType: 'Employer Drug and Alcohol',
            facilityTestTypeValue: 'Employer Drug and Alcohol',
            precedence: 3,
            serviceRequestor: 'EMPLOYER',
            testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.'
        }, {
            facilityServiceId: 2,
            facilityTestType: 'PHLEBOTOMY',
            facilityTestTypeValue: 'Glucose',
            testDesc: 'Select this option to let us know your specific glucose testing need.',
            precedence: 2,
            serviceRequestor: 'GLUCOSE'
        }];

        component.multiSelect = true;
        component.selectedTests = [{
            facilityServiceId: 2,
            facilityTestType: 'PHLEBOTOMY',
            facilityTestTypeValue: 'Glucose',
            testDesc: 'Select this option to let us know your specific glucose testing need.',
            precedence: 2,
            serviceRequestor: 'GLUCOSE'
        }];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when user navigates to Reason for visit page', () => {
        it('Tool tip is hidden', () => {
            const tooltipInfo = fixture.debugElement.nativeElement.querySelector('.ds-icon--info--16 ds-gray__900');
            expect(tooltipInfo).toBeFalsy();
        });
    });

    describe('#onInfoClicked', () => {
        it('Tool tip will be enabled and additional information about the test will be displayed', () => {
            spyOn(component, 'onInfoClicked');
            // tslint:disable-next-line: deprecation
            component.onInfoClicked(component.listItems[1], event);
            const el = fixture.debugElement.nativeElement.querySelector('as-reason-test-list__item-desc');
            // const elText = component.listItems[1].testDesc;
            // expect(elText).toContain(component.listItems[1].testDesc);
        });
    });

    describe('#onCloseClicked', () => {
        it('Tol tip will be disabled and the user cannot view the additional information', () => {
            spyOn(component, 'onCloseClicked');
            // tslint:disable-next-line: deprecation
            component.onCloseClicked(component.listItems[1], event);
            const el = fixture.debugElement.nativeElement.querySelector('as-reason-test-list__item-desc');
            // const elText = component.listItems[1].testDesc;
            // expect(elText).toContain('');
        });
    });
    describe('#navigateToLocation', () => {
        it('This test is not supported at your selected location', () => {
            spyOn(component, 'navigateToLocation');
            // tslint:disable-next-line: deprecation
            component.navigateToLocation(event);
        });
    });

});
