package com.wpz.rbs.service;

import com.google.api.client.http.GenericUrl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class RoomImportService {
    @Autowired
    UsosAuthService usosAuthService;

    public void getAll() throws IOException {
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/geo/building2");
        genericUrl.set("langpref", "pl");
        usosAuthService.usosApiRequest(genericUrl);
        int a =0;
    }
}
