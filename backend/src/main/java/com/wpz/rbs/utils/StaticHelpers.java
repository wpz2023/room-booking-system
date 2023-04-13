package com.wpz.rbs.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class StaticHelpers {
    public static final SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    public static Date parseDateTime(String dateTime) throws ParseException {
        return dateTimeFormat.parse(dateTime);
    }

    public static Date parseDate(String date) throws ParseException {
        return dateFormat.parse(date);
    }

    public static Date addDays(Date date, int days) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, days);
        return c.getTime();
    }

    public static boolean activitiesNotOverlapping(Date startDate1, Date endDate1, Date startDate2, Date endDate2) {
        return !((startDate1.compareTo(startDate2) >= 0 && startDate1.compareTo(endDate2) <= 0) || (endDate1.compareTo(startDate2) >= 0 && endDate1.compareTo(endDate2) <= 0) || (startDate1.compareTo(startDate2) <= 0 && endDate1.compareTo(endDate2) >= 0));
    }
}
