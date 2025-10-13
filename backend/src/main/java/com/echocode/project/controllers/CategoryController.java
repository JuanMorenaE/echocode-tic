package com.echocode.project.controllers;

import com.echocode.project.entities.Category;
import com.echocode.project.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @GetMapping
    public List<Category> GetCategories(){
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category GetAllCategories(@PathVariable int id){
        return categoryService.getCategoryById(id);
    }

    @PostMapping
    public Category AddCategory(@RequestBody Category category){
        if (categoryService.existsCategoryByName( category.getCategoryName()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category already exists");

        return categoryService.addCategory(category);
    }
}
