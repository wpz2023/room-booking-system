package com.wpz.rbs.controller.timetables;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("timetables")
public class TimetablesController {
//    @Autowired
//    ConfigurationHelpers configurationHelpers;
//
//    // good ID example: 3177
//    @GetMapping("room/{id}")
//    public String getRoomInfo(HttpServletRequest request, @PathVariable int id, @RequestParam(required = false) Date start, @RequestParam(required = false) @Min(1) @Max(7) Integer days) throws IOException {
//        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/tt/room");
//        genericUrl.set("room_id", id);
//        if (start != null) genericUrl.set("start", start);
//        if (days != null) genericUrl.set("days", days);
//        return configurationHelpers.usosApiGetRequestResult(request, genericUrl);
//    }
}
