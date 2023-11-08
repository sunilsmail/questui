import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from 'shared/services/user.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { AsTermsAndConditionsComponent } from './as-terms-and-conditions.component';

describe('AsTermsAndConditionsComponent', () => {
    let component: AsTermsAndConditionsComponent;
    let fixture: ComponentFixture<AsTermsAndConditionsComponent>;
    let debugElement: DebugElement;
    let userService: UserService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AsTermsAndConditionsComponent],
            providers: [
                { provide: UserService, useClass: MockUserService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(AsTermsAndConditionsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        userService= TestBed.inject(UserService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should get terms and conditions', () => {
        userService.getTermsAndConditions().subscribe(res => {
            expect(component.TermsNCo).toEqual(res);
        });
    });
});
