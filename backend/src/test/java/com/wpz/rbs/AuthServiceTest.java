package com.wpz.rbs;

import com.wpz.rbs.service.UsosAuthService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class AuthServiceTest {
    @Autowired
    private UsosAuthService usosAuthService;

    @Test
    public void authorize() throws IOException {
        usosAuthService.loginAfterStart();
    }
}
