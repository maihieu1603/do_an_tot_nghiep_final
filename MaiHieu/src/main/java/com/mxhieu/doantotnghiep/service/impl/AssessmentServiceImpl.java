package com.mxhieu.doantotnghiep.service.impl;

import com.mxhieu.doantotnghiep.converter.AssessmentConverter;
import com.mxhieu.doantotnghiep.dto.request.AssessmentRequest;
import com.mxhieu.doantotnghiep.dto.response.AssessmentOptionResponse;
import com.mxhieu.doantotnghiep.dto.response.AssessmentQuestionResponse;
import com.mxhieu.doantotnghiep.dto.response.AssessmentResponse;
import com.mxhieu.doantotnghiep.dto.response.ExerciseResponse;
import com.mxhieu.doantotnghiep.entity.*;
import com.mxhieu.doantotnghiep.exception.AppException;
import com.mxhieu.doantotnghiep.exception.ErrorCode;
import com.mxhieu.doantotnghiep.repository.AssessmentRepository;
import com.mxhieu.doantotnghiep.repository.ExerciseTypeRepository;
import com.mxhieu.doantotnghiep.repository.TestRepository;
import com.mxhieu.doantotnghiep.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final TestRepository testRepository;
    private final AssessmentConverter assessmentConverter;
    private final ExerciseTypeRepository exerciseTypeRepository;
    @Override
    public void createAssessment(AssessmentRequest assessmentRequest) {
        ExerciseTypeEntity exerciseTypeEntity = exerciseTypeRepository.findByCode(assessmentRequest.getType()).orElseThrow(()-> new AppException(ErrorCode.EXERCISE_TYPE_NOT_FOUND));
        TestEntity testEntity = testRepository.findById(assessmentRequest.getTestId()).orElseThrow(()->new AppException(ErrorCode.TEST_NOT_FOUND));
        AssessmentEntity assessmentEntity = assessmentConverter.toEntity(assessmentRequest, AssessmentEntity.class);
        assessmentEntity.setTest(testEntity);
        assessmentEntity.setExercisetype(exerciseTypeEntity);
        assessmentRepository.save(assessmentEntity);
    }

    @Override
    public List<AssessmentResponse> getSummaryAssessmentsByTestId(Integer testId) {
        List<AssessmentEntity> assessments = assessmentRepository.findByTestId(testId);
        List<AssessmentResponse> assessmentResponses = assessmentConverter.toResponseSummaryList(assessments);
        return assessmentResponses;
    }

    @Override
    public AssessmentResponse getAssessmentDetailById(Integer id) {
        AssessmentEntity assessmentEntity = assessmentRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.ASSESSMENT_NOT_FOUND));
        return assessmentConverter.toAssessmentDetailResponse(assessmentEntity);
    }

    @Override
    public void deleteAssessmentById(Integer id) {
        assessmentRepository.deleteById(id);
    }

    @Override
    public List<AssessmentResponse> getAssessmentsDetailByTestId() {
        List<TestEntity> testEntities = testRepository.findByType("FIRST_TEST");

        if (testEntities.isEmpty()) {
            throw new RuntimeException("No test found");
        }

        TestEntity randomTest =
                testEntities.get(new Random().nextInt(testEntities.size()));

        Integer randomTestId = randomTest.getId();


        List<AssessmentEntity> assessmentEntities = assessmentRepository.findByTestId(randomTestId);
        List<AssessmentResponse> assessmentResponses = new ArrayList<>();
        assessmentEntities.stream().forEach(assessmentEntity -> {
            switch (assessmentEntity.getExercisetype().getCode()) {
                case "LISTENING_1" :
                case "LISTENING_2" :
                case "READING_6":
                case "READING_7":
                case "LISTENING_3_4":
                    assessmentResponses.add(assessmentConverter.toAssessmentDetailResponse(assessmentEntity));
                    break;
                default:
                    assessmentResponses.addAll(assessmentConverter.toSplitAssessmentDetailResponse(assessmentEntity));
            }

        });
        return  assessmentResponses;
    }

    @Override
    public List<AssessmentResponse> getAssessmentsDetailByTestId(int testId) {
        List<AssessmentEntity> assessmentEntities = assessmentRepository.findByTestId(testId);
        List<AssessmentResponse> assessmentResponses = new ArrayList<>();
        assessmentEntities.stream().forEach(assessmentEntity -> {
            switch (assessmentEntity.getExercisetype().getCode()) {
                case "LISTENING_1" :
                case "LISTENING_2" :
                case "READING_6":
                case "READING_7":
                case "LISTENING_3_4":
                    assessmentResponses.add(assessmentConverter.toAssessmentDetailResponse(assessmentEntity));
                    break;
                default:
                    assessmentResponses.addAll(assessmentConverter.toSplitAssessmentDetailResponse(assessmentEntity));
            }

        });
        return  assessmentResponses;
    }
}
