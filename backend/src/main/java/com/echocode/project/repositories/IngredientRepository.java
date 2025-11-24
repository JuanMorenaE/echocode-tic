package com.echocode.project.repositories;

import com.echocode.project.entities.Ingredient;
import com.echocode.project.enums.IngredientType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    public List<Ingredient> getIngredientsByType(IngredientType type);
}
