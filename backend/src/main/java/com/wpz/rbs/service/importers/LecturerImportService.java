package com.wpz.rbs.service.importers;

import java.io.IOException;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.model.Lecturer;
import com.wpz.rbs.service.LecturerService;
import com.wpz.rbs.service.UsosAuthService;

@Service
public class LecturerImportService {

    private final UsosAuthService usosAuthService;
    private final LecturerService lecturerService;

    private final ObjectMapper mapper = new ObjectMapper();

    public LecturerImportService(UsosAuthService usosAuthService, LecturerService lecturerService) {
        this.usosAuthService = usosAuthService;
        this.lecturerService = lecturerService;
    }

    public Lecturer getOrImportLecturer(int lecturerId) throws IOException {
        var lecturerOptional = lecturerService.getByIdOptional(lecturerId);

        if(lecturerOptional.isPresent()){
            return lecturerOptional.get();
        }

        var genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/users/user");
        genericUrl.set("user_id", lecturerId);
        genericUrl.set("fields", "id|first_name|last_name");

        String jsonResponse = usosAuthService.executeUsosApiRequest(genericUrl).parseAsString();

        var lecturer = mapper.readValue(jsonResponse, Lecturer.class);

        return lecturerService.saveOrUpdate(lecturer);
    }
}
