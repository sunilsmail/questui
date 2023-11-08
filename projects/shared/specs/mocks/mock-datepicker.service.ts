export class MockDatePickerService {
    getDayNames(year: number, month: number, maxScheduleDays) {
        const maxApptScheduleDate = new Date();
        // adding 195 days which is reading from ui properties.
        maxApptScheduleDate.setDate(maxApptScheduleDate.getDate() + maxScheduleDays);
        const calMap = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month - 1, i);
            const dayName = days[d.getDay()];
            const currentdate = new Date();
            if (d > maxApptScheduleDate) {
                calMap.push({ 'date': i, 'day': dayName, 'month': month, 'year': year, 'disabled': true });
            } else {
                if ((d.setHours(0, 0, 0, 0) < currentdate.setHours(0, 0, 0, 0))) {
                    calMap.push({ 'date': i, 'day': dayName, 'month': month, 'year': year, 'disabled': true });
                } else {
                    calMap.push({ 'date': i, 'day': dayName, 'month': month, 'year': year, 'disabled': false });
                }
            }
        }
        return calMap;
    }
    dateRange(startDate, endDate, months) {
        const start = startDate.split('-');
        const end = endDate.split('-');
        const startYear = parseInt(start[0], 10);
        const endYear = parseInt(end[0], 10);
        const monthList = [];
        for (let i = startYear; i <= endYear; i++) {
            const endMonth = i !== endYear ? 11 : parseInt(end[1], 10) - 1;
            const startMon = i === startYear ? parseInt(start[1], 10) - 1 : 0;
            for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
                const month = j + 1;
                const displayMonth = month < 10 ? Number('0' + month) : month;
                monthList.push({ month: months[displayMonth - 1], year: i, index: displayMonth - 1 });
            }
        }
        return monthList;
    }
}
