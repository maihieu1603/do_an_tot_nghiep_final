package com.mxhieu.doantotnghiep.controller;


import com.mxhieu.doantotnghiep.dto.request.AuthenticationRequest;
import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.dto.response.AuthenticationResponse;
import com.mxhieu.doantotnghiep.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse response = authenticationService.logIn(authenticationRequest);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Đăng nhập thành công")
                .data(response)
                .build();
    }
    @PostMapping("/refresh-token")
    public ApiResponse<AuthenticationResponse> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        AuthenticationResponse response = authenticationService.refreshToken(refreshToken);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Làm mới token thành công")
                .data(response)
                .build();
    }
}
