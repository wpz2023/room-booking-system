package com.wpz.rbs.controllers.timetables;

import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.wpz.rbs.controllers.auth.models.LoggedInAuthModel;
import com.wpz.rbs.configuration.ConfigurationHelpers;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController("timetables")
public class TimetablesController {
    private final ConfigurationHelpers configurationHelpers;

    public TimetablesController(ConfigurationHelpers configurationHelpers) {
        this.configurationHelpers = configurationHelpers;
    }

    // good ID example: 3177
    // TODO: should be GetMapping - change type after saving credentials to database
    @PutMapping("room/{id}")
    public String getRoomInfo(@PathVariable int id, int days, @RequestBody LoggedInAuthModel authModel) throws IOException {
        // TODO: fields in params and variable in proper range check - now it is made only for testing purposes
        // Use OAuthParameters to access the desired Resource URL
        HttpRequestFactory requestFactory = new NetHttpTransport().createRequestFactory(configurationHelpers.generateAuthForEndpoints(authModel));
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/tt/room");
        genericUrl.set("room_id", id);
        HttpResponse response = requestFactory.buildGetRequest(genericUrl).execute();
        return response.parseAsString();
    }
}
