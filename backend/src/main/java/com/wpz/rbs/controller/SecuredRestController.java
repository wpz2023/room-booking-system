package com.wpz.rbs.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

// interface annotating controller to require auth
@SecurityRequirement(name = "bearerAuth")
public interface SecuredRestController {
}
