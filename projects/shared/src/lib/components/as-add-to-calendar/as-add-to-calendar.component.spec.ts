import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { AsAddToCalendarComponent } from './as-add-to-calendar.component';

describe('AsAddToCalendarComponent', () => {
    let component: AsAddToCalendarComponent;
    let fixture: ComponentFixture<AsAddToCalendarComponent>;
    const formattedEndDate = new Date('2019-12-24T07:15').toISOString().replace(/-|:|\.\d+/g, '');
    const formattedStartDate = new Date('2019-12-24T07:00').toISOString().replace(/-|:|\.\d+/g, '');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AsAddToCalendarComponent],
            imports: [RouterTestingModule, MockI18nModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AsAddToCalendarComponent);
        component = fixture.componentInstance;
        component.inputEvent = {
            appointmentDate: '2019-12-24',
            appointmentTime: '07:00',
            name: 'Diagnostic Laboratory of Oklahoma - Miami ',
            address1: '500 Plaza drive',
            address2: 'Suite 900',
            city: 'berlin',
            state: 'NJ',
            zip: '08091',
            title: 'some',
            siteCode: 'ACV',
            confirmationCode: 'QSDDFF',
            phone: 2122223256
        };
        spyOn(component, 'getGoogleUri').and.callThrough();
        spyOn(component, 'getYahooUri').and.callThrough();
        spyOn(component, 'getIcs').and.callThrough();
        spyOn(component, 'getIcal').and.callThrough();
        spyOn(component, 'getOutlook').and.callThrough();
        spyOn(component, 'formatTime').and.callThrough();
        spyOn(component, 'calculateEndTime').and.callThrough();

        fixture.detectChanges();
    });

    it('should set the event', () => {
        const date = new Date(`${component.inputEvent.appointmentDate}T${component.inputEvent.appointmentTime}`);
        expect(component.event.start).toEqual(date);
    });

    // it('should test window.navigator.userAgent', () => {
    //     window.navigator['__defineGetter__']('userAgent', function () {
    //         return ['Trident/'];
    //     });
    //     component.ngOnInit();
    //     expect(component.isIE).toBeTruthy();
    // });

    it('should call getGoogleUri, getYahooUri, getIcal, getOutlook', () => {
        expect(component.getGoogleUri).toHaveBeenCalled();
        expect(component.getYahooUri).toHaveBeenCalled();
        expect(component.getIcal).toHaveBeenCalled();
        expect(component.getOutlook).toHaveBeenCalled();
    });

    describe('formatTime', () => {
        it('should return formated dated', () => {
            expect(component.formatTime(component.event.start)).toEqual(formattedStartDate);
        });
    });

    describe('calculateEndTime', () => {
        it('should call formatTime', () => {
            component.calculateEndTime(component.event);
            expect(component.formatTime).toHaveBeenCalled();
        });

        it('should return same time as startTime, duration is 0', () => {
            expect(component.calculateEndTime(component.event)).toEqual(formattedEndDate);
        });
    });

    describe('getGoogleUri', () => {
        it('should call formatTime', () => {
            component.getGoogleUri(component.event);
            expect(component.formatTime).toHaveBeenCalled();
        });
        it('should call calculateEndTime', () => {
            component.getGoogleUri(component.event);
            expect(component.calculateEndTime).toHaveBeenCalled();
        });

        it('should return same time as startTime, duration is 0', () => {
            component.getGoogleUri(component.event);
            expect(component.googleUri).toContain(formattedStartDate);
        });
    });

    describe('getYahooUri', () => {
        it('should call formatTime', () => {
            component.getYahooUri(component.event);
            expect(component.formatTime).toHaveBeenCalled();
        });
        it('should return duration 15 min', () => {
            component.getYahooUri(component.event);

            expect(component.yahooUri).toContain(formattedStartDate);
        });
    });

    describe('getIcs', () => {
        it('should call formatTime', () => {
            component.getIcs(component.event);
            expect(component.formatTime).toHaveBeenCalled();
        });
        it('should call calculateEndTime', () => {
            component.getIcs(component.event);
            expect(component.calculateEndTime).toHaveBeenCalled();
        });
    });

    describe('getIcsForDownload', () => {
        it('should call formatTime', () => {
            component.getIcsForDownload(component.event);
            expect(component.formatTime).toHaveBeenCalled();
        });
        it('should call calculateEndTime', () => {
            component.getIcsForDownload(component.event);
            expect(component.calculateEndTime).toHaveBeenCalled();
        });
    });

    describe('getIcal', () => {
        it('should call getIcs', () => {
            component.getIcal(component.event);
            expect(component.getIcs).toHaveBeenCalled();
        });
    });

    describe('getOutlook', () => {
        it('should call getIcs', () => {
            component.getOutlook(component.event);
            expect(component.getIcs).toHaveBeenCalled();
        });
    });

    describe('openDialog', () => {
        it('should call stoppropagation', () => {
            const ev = new MouseEvent('click');
            spyOn(ev, 'stopPropagation').and.callThrough();
            component.openDialog(ev);
            expect(ev.stopPropagation).toHaveBeenCalled();
        });

        it('should set showdialog to true', () => {
            const ev = new MouseEvent('click');
            component.openDialog(ev);
            expect(component.showDialog).toBeTruthy();
        });
    });

    describe('onDocumentClick', () => {
        it('should call stoppropagation', () => {
            const ev = new MouseEvent('click');
            component.showDialog = true;
            component.onDocumentClick(ev);
            expect(component.showDialog).toBeFalsy();
        });

    });
    describe('getTimeInFormat', () => {
        it('should return formatted time', () => {
            const result = component.tConvert('12:00');
            expect(result).toEqual('12:00 PM');
        });
    });
});
