package com.mxhieu.doantotnghiep.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mxhieu.doantotnghiep.dto.request.CourseRequest;
import com.mxhieu.doantotnghiep.dto.request.ModuleRequest;
import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping(consumes = "multipart/form-data")
    public ApiResponse<?> createCourse(
            @RequestPart("course") String courseJson,   // Nhận dưới dạng String
            @RequestPart("image") MultipartFile imageFile) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            CourseRequest courseRequest = mapper.readValue(courseJson, CourseRequest.class);
            System.out.println(courseRequest);
            courseService.addCourseToTrack(courseRequest, imageFile);

            return ApiResponse.builder()
                    .code(200)
                    .message("Course Created")
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .code(500)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    @PutMapping("/publish/{id}")
    public ApiResponse<?> publishCourse(@PathVariable Integer id) {
        courseService.publishCourse(id);
        return ApiResponse.builder().code(200).message("Course Published").build();
    }
    @GetMapping
    public ApiResponse<?> getAllCourses() {
        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data(courseService.getAllCourses())
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<?> getCourseById(@PathVariable Integer id) {
        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data(courseService.getCourseById(id))
                .build();
    }

    @GetMapping("{courseId}/student/{studentId}")
    public ApiResponse<?> getCourseByIdByStudent(@PathVariable Integer courseId, @PathVariable Integer studentId) {
        CourseRequest courseRequest = CourseRequest.builder()
                .id(courseId)
                .studentProfileId(studentId)
                .build();
        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data(courseService.getCourseForStudent(courseRequest))
                .build();
    }
    @GetMapping("/teacher")
    public ApiResponse<?> getCourseByIdByTeacher(@RequestParam Integer courseId, @RequestParam(required = false) Integer version) {
        CourseRequest courseRequest = CourseRequest.builder()
                .id(courseId)
                .version(version)
                .build();
        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data(courseService.getCourseAndModuleByCourseIdForTeacher(courseRequest))
                .build();
    }
    @GetMapping("/teacher/{teacherId}")
    public ApiResponse<?> getCoursesByTeacherId(@PathVariable Integer teacherId) {
        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data(courseService.getCoursesByTeacherId(teacherId))
                .build();
    }
}
