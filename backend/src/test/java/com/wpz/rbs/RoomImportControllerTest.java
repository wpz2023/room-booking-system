package com.wpz.rbs;

import com.wpz.rbs.controller.roomimport.RoomImportController;
import com.wpz.rbs.service.RoomImportService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(RoomImportController.class)
public class RoomImportControllerTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private RoomImportService service;

    @Test
    public void test() throws Exception {
//        assert service.getAll().size() > 0;
        mvc.perform(MockMvcRequestBuilders.get("/roomsImport").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }
}
