package com.echocode.project.repositories;

import com.echocode.project.entities.Product;
import com.echocode.project.entities.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByProductType(ProductType productType);
    List<Product> findByIsAvailableTrue();
    List<Product> findByProductTypeAndIsAvailableTrue(ProductType productType);
}
