package com.echocode.project.controllers;

import com.echocode.project.dto.AddressResponse;
import com.echocode.project.entities.Ingredient;
import com.echocode.project.enums.IngredientType;
import com.echocode.project.services.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<List<Ingredient>> getAll() {
        List<Ingredient> ingredients = ingredientService.getAll();
        return ResponseEntity.ok(ingredients);
    }

    @PostMapping("/type")
    public ResponseEntity<List<Ingredient>> getAllByType(@RequestBody IngredientType type) {
        List<Ingredient> ingredients = ingredientService.getAllByType(type);
        return ResponseEntity.ok(ingredients);
    }


    @PostMapping
    public ResponseEntity<Ingredient> create(@RequestBody Ingredient ingredient) {
        Ingredient createdIngredient = ingredientService.create(ingredient);
        return ResponseEntity.ok(createdIngredient);
    }

    @PutMapping
    public ResponseEntity<Ingredient> update(@RequestBody Ingredient ingredient) {
        Ingredient updatedIngredient = ingredientService.update(ingredient);
        return ResponseEntity.ok(updatedIngredient);
    }
}
