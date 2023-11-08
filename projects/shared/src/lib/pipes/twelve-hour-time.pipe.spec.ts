import { TwelveHourTimePipe } from './twelve-hour-time.pipe';

describe('TwelveHourTimePipe', () => {
    it('create an instance', () => {
        const pipe = new TwelveHourTimePipe();
        expect(pipe).toBeTruthy();
    });

    it('returns null if there is no value', () => {
        const pipe = new TwelveHourTimePipe();
        expect(pipe.transform('')).toEqual(null);
    });

    it('appends AM if hours is < 12', () => {
        const pipe = new TwelveHourTimePipe();
        expect(pipe.transform('11:59')).toEqual('11:59 AM');
    });

    it('replaces 00 with 12 if hours = 00', () => {
        const pipe = new TwelveHourTimePipe();
        expect(pipe.transform('00:59')).toEqual('12:59 AM');
    });

    it('appends PM if hours is >= 12', () => {
        const pipe = new TwelveHourTimePipe();
        expect(pipe.transform('12:00')).toEqual('12:00 PM');
    });

    it('subtracts 12 if hours is >= 13', () => {
        const pipe = new TwelveHourTimePipe();
        expect(pipe.transform('13:00')).toEqual('1:00 PM');
    });
});
