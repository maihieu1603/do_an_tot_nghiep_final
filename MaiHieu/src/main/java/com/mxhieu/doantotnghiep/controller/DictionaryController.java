package com.mxhieu.doantotnghiep.controller;


import com.mxhieu.doantotnghiep.dto.response.ApiResponse;
import com.mxhieu.doantotnghiep.dto.response.DictionaryResponse;
import com.mxhieu.doantotnghiep.service.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dictionary")
@RequiredArgsConstructor
public class DictionaryController {
    private final DictionaryService dictionaryService;
    @GetMapping()
    public ApiResponse<?> searchInDictionary(@RequestParam String word){
        return ApiResponse.builder()
                .code(200)
                .data(dictionaryService.search(word))
                .build();
    }
    @GetMapping("/suggestion")
    public ApiResponse<?> suggestion(@RequestParam String word){
        return ApiResponse.builder()
                .code(200)
                .data(dictionaryService.getSuggestionWord(word))
                .build();
    }
}
