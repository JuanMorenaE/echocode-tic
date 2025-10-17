package com.echocode.project.repositories;

import com.echocode.project.entities.Category;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    public Category findByCategoryId(@NonNull Long categoryId);

    public boolean existsByCategoryName(@NonNull String categoryName);
}
