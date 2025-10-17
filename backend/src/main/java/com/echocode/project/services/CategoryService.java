package com.echocode.project.services;

import com.echocode.project.entities.Category;
import com.echocode.project.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category getById(long categoryId) {
        return categoryRepository.findByCategoryId(categoryId);
    }

    public boolean existsByName(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }

    public Category create(Category category) {
        if(existsByName(category.getCategoryName()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category already exists");

        return categoryRepository.save(category);
    }
}
