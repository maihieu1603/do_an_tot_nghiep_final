package com.mxhieu.doantotnghiep.controller;


import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.entity.EnrollmentCourseEntity;
import com.mxhieu.doantotnghiep.service.EnrollmentServece;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentServece enrollmentServece;
    @GetMapping("/student/{studenId}")
    public ApiResponse<?> getStudentEnrollments(@PathVariable Integer studenId) {
        return ApiResponse.builder()
                .code(200)
                .data(enrollmentServece.getStudentEnrollmenteds(studenId))
                .build();
    }
    @GetMapping("/studyFolow/{studentId}")
    public ApiResponse<?> getPreviewStudyFolow(@PathVariable Integer studentId) {
        return ApiResponse.builder()
                .code(200)
                .data(enrollmentServece.getPreviewStudyFlow(studentId))
                .build();
    }
}
