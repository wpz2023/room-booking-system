import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import {Navigate} from 'react-big-calendar'
// @ts-ignore
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

export default function CustomWeekView({
                                           date,
                                           localizer,
                                           max = localizer.endOf(new Date(), 'day'),
                                           min = localizer.startOf(new Date(), 'day'),
                                           scrollToTime = localizer.startOf(new Date(), 'day'),
                                           countOfDays,
                                           ...props
                                       }) {
    const title = CustomWeekView.title(date, {localizer}, countOfDays);
    const currRange = useMemo(() => CustomWeekView.range(date, {localizer}, countOfDays), [date, localizer, countOfDays])
    return (
        <div>
            <div className="rbc-toolbar rbc-toolbar-label">
                {title}
            </div>
            <TimeGrid
                date={date}
                eventOffset={15}
                localizer={localizer}
                max={max}
                min={min}
                range={currRange}
                scrollToTime={scrollToTime}
                countOfDays={countOfDays}
                {...props}
            /></div>)
}

CustomWeekView.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    localizer: PropTypes.object,
    max: PropTypes.instanceOf(Date),
    min: PropTypes.instanceOf(Date),
    scrollToTime: PropTypes.instanceOf(Date),
    countOfDays: PropTypes.number
}

CustomWeekView.range = (date: Date, {localizer}, countOfDays: number) => {
    const start = date
    const end = localizer.add(start, countOfDays, 'day')

    let current = start
    const range = []

    while (localizer.lte(current, end, 'day')) {
        range.push(current)
        current = localizer.add(current, 1, 'day')
    }

    return range
}

CustomWeekView.navigate = (date: Date, action, {localizer}, countOfDays: number) => {
    // without this mock it will break whole calendar - anyway still will use passed countOfDays instead of hardcoded 2
    countOfDays = countOfDays ?? 2
    switch (action) {
        case Navigate.PREVIOUS:
            return localizer.add(date, -1 * countOfDays, 'day')

        case Navigate.NEXT:
            return localizer.add(date, countOfDays, 'day')

        default:
            return date
    }
}

CustomWeekView.title = (date: Date, {localizer}, countOfDays: number) => {
    // without this mock it will break whole calendar - anyway still will use passed countOfDays instead of hardcoded 2
    countOfDays = countOfDays ?? 2
    const [start, ...rest] = CustomWeekView.range(date, {localizer}, countOfDays)
    const noDatesInArray = rest.length === 0;
    return noDatesInArray ? localizer.format(start, 'dayHeaderFormat') : localizer.format({
        start,
        end: rest.pop()
    }, 'dayRangeHeaderFormat')
}