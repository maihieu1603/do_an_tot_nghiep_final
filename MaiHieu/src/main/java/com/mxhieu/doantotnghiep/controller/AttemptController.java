package com.mxhieu.doantotnghiep.controller;


import com.mxhieu.doantotnghiep.dto.request.AttemptRequest;
import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.service.AttemptSevice;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attempts")
@RequiredArgsConstructor
public class AttemptController {
    private final AttemptSevice attemptSevice;
    @PutMapping()
    public ApiResponse<?> saveAttempt(@RequestBody AttemptRequest attemptRequest) {
        attemptSevice.saveAttempt(attemptRequest);
        return ApiResponse.builder()
                .code(200)
                .message("Save attempt success")
                .build();
    }
}
