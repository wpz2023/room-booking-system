package com.wpz.rbs.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertiesUtils {

    public static String getAdminEmail() {
        return getAdminProperties().getProperty("email");
    }

    public static String getAdminPassword() {
        return "{noop}" + getAdminProperties().getProperty("password");
    }

    private static Properties getAdminProperties() {
        String resourcesPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
        String adminPropertiesPath = resourcesPath + "../../../admin.properties";

        Properties properties = new Properties();

        try {
            properties.load(new FileInputStream(adminPropertiesPath));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return properties;
    }
}
