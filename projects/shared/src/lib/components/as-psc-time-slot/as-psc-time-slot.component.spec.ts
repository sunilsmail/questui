import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { AsPscTimeSlotComponent } from './as-psc-time-slot.component';


describe('AsPscTimeSlotComponent', () => {
    let component: AsPscTimeSlotComponent;
    let fixture: ComponentFixture<AsPscTimeSlotComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CustomPipesModule],
            declarations: [AsPscTimeSlotComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AsPscTimeSlotComponent);
        component = fixture.componentInstance;
        component.timeSlots = [{
            time: '10:45',
            available: false
        }, {
            time: '11:00',
            available: false
        }, {
            time: '11:15',
            available: true
        }, {
            time: '11:30',
            available: true
        }, {
            time: '11:45',
            available: true
        }];
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('availableSlots', () => {
        it('should set availbleSlot with available true', () => {
            expect(component.availableSlots).toContain({
                time: '11:30',
                available: true
            });
        });
        it('should not set availbleSlot with available true', () => {
            expect(component.availableSlots).not.toContain({
                time: '10:45',
                available: false
            });
        });
    });

    describe('selectTime', () => {
        it('should set timeSelected to timeSlot when other than timeSlot', () => {
            component.selectTime('8:00');
            expect(component.timeSelected).toBe('8:00');
        });
        it('should set timeSelected to null when already equals to timeSlot', () => {
            component.timeSelected = '8:00';
            component.selectTime('8:00');
            expect(component.timeSelected).toBe(null);
        });

        it('should set timeSelected to null when already equals to timeSlot', () => {
            spyOn(component.selectedTime, 'emit');
            component.selectTime('8:00');
            expect(component.selectedTime.emit).toHaveBeenCalledWith('8:00');
        });
    });

    describe('show more', () => {
        it('should switch the boolean value o show', () => {
            component.showmore();
            expect(component.show).toBe(true);
        });

    });


});
