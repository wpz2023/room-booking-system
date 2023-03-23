package com.wpz.rbs.controller.timetables;

import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.configuration.ConfigurationHelpers;
import com.wpz.rbs.controller.SecuredRestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;

@RestController
@RequestMapping("timetables")
public class TimetablesController implements SecuredRestController {
    @Autowired
    ConfigurationHelpers configurationHelpers;

    // good ID example: 3177
    @GetMapping("room/{id}")
    public String getRoomInfo(HttpServletRequest request, @PathVariable int id, @RequestParam(required = false) Date start, @RequestParam(required = false) @Min(1) @Max(7) Integer days) throws IOException {
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/tt/room");
        genericUrl.set("room_id", id);
        if (start != null) genericUrl.set("start", start);
        if (days != null) genericUrl.set("days", days);
        return configurationHelpers.usosApiGetRequestResult(request, genericUrl);
    }
}
