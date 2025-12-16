package com.mxhieu.doantotnghiep.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mxhieu.doantotnghiep.dto.request.AssessmentQuestionRequest;
import com.mxhieu.doantotnghiep.dto.request.QuestionRequest;
import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.service.AssessmentOptionService;
import com.mxhieu.doantotnghiep.service.AssessmentQuestionAndChoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("assessmentquesstions")
@RequiredArgsConstructor
public class AssessmentQuestionAndChoiceController {
    private final AssessmentQuestionAndChoiceService assessmentQuestionAndChoiceService;
    private final AssessmentOptionService assessmentOptionService;
    @PostMapping(consumes = "multipart/form-data")
    public ApiResponse<?> createQuestions(
            @RequestPart("requests") AssessmentQuestionRequest questionRequest,
            @RequestPart(required = false) MultipartFile file
    ) {
        assessmentQuestionAndChoiceService.createQuestionAndChoices(questionRequest, file);
        return ApiResponse.builder()
                .code(200)
                .message("Created successfully")
                .build();
    }

    @PutMapping(consumes = "multipart/form-data")
    public ApiResponse<?> updateQuestions(@RequestPart("requests") AssessmentQuestionRequest questionRequest,
                                          @RequestPart(required = false) MultipartFile file
    ){

        assessmentQuestionAndChoiceService.updateQuestionndChoices(questionRequest,file);
        return ApiResponse.builder()
                .code(200)
                .message("update successfully")
                .build();
    }
    @DeleteMapping("/{id}")
    ApiResponse<?> deleteAssessmentQuestion(@PathVariable Integer id) {
        assessmentQuestionAndChoiceService.deleteAssessmentQuestionById(id);
        return ApiResponse.builder()
                .code(200)
                .message("Deleted")
                .build();
    }
}
