package com.wpz.rbs.utils;

import org.junit.jupiter.api.Test;

import java.text.ParseException;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class StaticHelpersTest {

    @Test
    void shouldReturnTrueWhenFirstMeetingInsideSecondMeeting() throws ParseException {
        Date startDate1 = StaticHelpers.parseDateTime("2023-04-17 09:00:00");
        Date endDate1 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");
        Date startDate2 = StaticHelpers.parseDateTime("2023-04-17 08:00:00");
        Date endDate2 = StaticHelpers.parseDateTime("2023-04-17 11:00:00");

        boolean result = StaticHelpers.activitiesOverlapping(startDate1, endDate1, startDate2, endDate2);

        assertTrue(result);
    }

    @Test
    void shouldReturnTrueWhenFirstMeetingStartsBeforeSecondMeetingEnd() throws ParseException {
        Date startDate1 = StaticHelpers.parseDateTime("2023-04-17 09:00:00");
        Date endDate1 = StaticHelpers.parseDateTime("2023-04-17 11:00:00");
        Date startDate2 = StaticHelpers.parseDateTime("2023-04-17 08:00:00");
        Date endDate2 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");

        boolean result = StaticHelpers.activitiesOverlapping(startDate1, endDate1, startDate2, endDate2);

        assertTrue(result);
    }

    @Test
    void shouldReturnTrueWhenSecondMeetingStartsBeforeFirstMeetingEnd() throws ParseException {
        Date startDate1 = StaticHelpers.parseDateTime("2023-04-17 08:00:00");
        Date endDate1 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");
        Date startDate2 = StaticHelpers.parseDateTime("2023-04-17 09:00:00");
        Date endDate2 = StaticHelpers.parseDateTime("2023-04-17 11:00:00");

        boolean result = StaticHelpers.activitiesOverlapping(startDate1, endDate1, startDate2, endDate2);

        assertTrue(result);
    }

    @Test
    void shouldReturnTrueWhenSecondMeetingInsideFirstMeeting() throws ParseException {
        Date startDate1 = StaticHelpers.parseDateTime("2023-04-17 08:00:00");
        Date endDate1 = StaticHelpers.parseDateTime("2023-04-17 11:00:00");
        Date startDate2 = StaticHelpers.parseDateTime("2023-04-17 09:00:00");
        Date endDate2 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");

        boolean result = StaticHelpers.activitiesOverlapping(startDate1, endDate1, startDate2, endDate2);

        assertTrue(result);
    }

    @Test
    void shouldReturnFalseWhenFirstMeetingBeforeSecondMeeting() throws ParseException {
        Date startDate1 = StaticHelpers.parseDateTime("2023-04-17 08:00:00");
        Date endDate1 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");
        Date startDate2 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");
        Date endDate2 = StaticHelpers.parseDateTime("2023-04-17 11:00:00");

        boolean result = StaticHelpers.activitiesOverlapping(startDate1, endDate1, startDate2, endDate2);

        assertFalse(result);
    }

    @Test
    void shouldReturnFalseWhenFirstMeetingAfterSecondMeeting() throws ParseException {
        Date startDate1 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");
        Date endDate1 = StaticHelpers.parseDateTime("2023-04-17 11:00:00");
        Date startDate2 = StaticHelpers.parseDateTime("2023-04-17 08:00:00");
        Date endDate2 = StaticHelpers.parseDateTime("2023-04-17 10:00:00");

        boolean result = StaticHelpers.activitiesOverlapping(startDate1, endDate1, startDate2, endDate2);

        assertFalse(result);
    }
}