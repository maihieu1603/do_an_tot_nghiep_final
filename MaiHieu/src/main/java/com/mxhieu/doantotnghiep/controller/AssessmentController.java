package com.mxhieu.doantotnghiep.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mxhieu.doantotnghiep.dto.request.AssessmentRequest;
import com.mxhieu.doantotnghiep.dto.request.ExerciseRequest;
import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.dto.response.ExerciseResponse;
import com.mxhieu.doantotnghiep.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@RestController
@RequestMapping("assessments")
@RequiredArgsConstructor
public class AssessmentController {
    private final AssessmentService assessmentService;

    @PostMapping(consumes = "multipart/form-data")
    ApiResponse<?> createAssessment(@RequestPart String request,
                                  @RequestPart(required = false) MultipartFile mediaData,
                                  @RequestPart(required = false) MultipartFile imgData){
        ObjectMapper mapper = new ObjectMapper();
        AssessmentRequest assessmentRequest = null;
        try{
            assessmentRequest = mapper.readValue(request,AssessmentRequest.class);
            if(mediaData != null) assessmentRequest.setMediaData(mediaData.getBytes());
            if(imgData != null) assessmentRequest.setImageData(imgData.getBytes());
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        assessmentService.createAssessment(assessmentRequest);
        ApiResponse<ExerciseResponse> response = ApiResponse.<ExerciseResponse>builder()
                .code(200)
                .message("Assessment Created")
                .build();
        return response;
    }
    @GetMapping("/test/{testID}/summary")
    ApiResponse<?> getSummaryAssessmentsByTestId(@PathVariable Integer testID) {
        return ApiResponse.builder()
                .code(200)
                .data(assessmentService.getSummaryAssessmentsByTestId(testID))
                .build();
    }
    @GetMapping("/{id}")
    ApiResponse<?> getAssessmentDetailById(@PathVariable Integer id) {
        return ApiResponse.builder()
                .code(200)
                .data(assessmentService.getAssessmentDetailById(id))
                .build();
    }
    @DeleteMapping("/{id}")
    ApiResponse<?> deleteAssessment(@PathVariable Integer id) {
        assessmentService.deleteAssessmentById(id);
        return ApiResponse.builder()
                .code(200)
                .message("Assessment Deleted")
                .build();
    }

    @GetMapping("/firsttest")
    ApiResponse<?> getAssessmentDetailForFistTest() {
        return ApiResponse.builder()
                .code(200)
                .data(assessmentService.getAssessmentDetailForFistTest())
                .build();

    }
    @GetMapping("/mini-test/{id}")
    ApiResponse<?> getAssessmentDetailByTestId(@PathVariable Integer id) {
        return ApiResponse.builder()
                .code(200)
                .data(assessmentService.getAssessmentsDetailByTestId(id))
                .build();
    }

}
