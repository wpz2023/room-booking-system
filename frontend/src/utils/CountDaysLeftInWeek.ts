export function countDaysLeftInWeek(startDate: Date, endDate: Date): number {
    // 0 = Sunday, 1 = Monday and so on in getDay()
    let startDay = startDate.getDay();
    let endDay = endDate.getDay();

    const dummyDate = new Date(0, 0, 0);

    if (dummyDate.getFullYear() === startDate.getFullYear()) {
        startDay = 1;
    } else if (startDay === 0) {
        startDay = 7;
    }

    if (dummyDate.getFullYear() === endDate.getFullYear() || endDay === 0) {
        endDay = 7;
    }

    return endDay - startDay + 1;
}