package com.echocode.project.services;

import com.echocode.project.entities.Category;
import com.echocode.project.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(int categoryId) {
        return categoryRepository.findByCategoryId(categoryId);
    }

    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    public boolean existsCategoryByName(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }
}
