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

    public static String dateToString(Date date) throws ParseException {
        return dateFormat.format(date);
    }

    public static Date dateTimeToDate(Date date) throws ParseException {
        return dateFormat.parse(dateFormat.format(date));
    }

    public static Date addDays(Date date, int days) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, days);
        return c.getTime();
    }

    public static Date getPreviousOctober(Date date){
        Calendar c = Calendar.getInstance();
        c.setTime(date);

        if(c.get(Calendar.MONTH) < Calendar.OCTOBER){
            c.set(Calendar.YEAR, c.get(Calendar.YEAR) - 1);
        }
        c.set(Calendar.MONTH, Calendar.OCTOBER);
        c.set(Calendar.DAY_OF_MONTH, 1);
        
        return c.getTime();
    }

    public static boolean activitiesOverlapping(Date startDate1, Date endDate1, Date startDate2, Date endDate2) {
        boolean condition1 = endDate1.compareTo(startDate2) <= 0;
        boolean condition2 = startDate1.compareTo(endDate2) >= 0;
        return !(condition1 || condition2);
    }
}
