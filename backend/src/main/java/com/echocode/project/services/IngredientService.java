package com.echocode.project.services;

import com.echocode.project.entities.Category;
import com.echocode.project.entities.Ingredient;
import com.echocode.project.enums.IngredientType;
import com.echocode.project.repositories.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository;

    public List<Ingredient> getAll() {
        return ingredientRepository.findAll();
    }

    public List<Ingredient> getAllByType(IngredientType type) {
        return ingredientRepository.getIngredientsByType(type);
    }

    public Ingredient create(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }
}
