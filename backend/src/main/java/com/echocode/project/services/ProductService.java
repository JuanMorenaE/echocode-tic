package com.echocode.project.services;

import com.echocode.project.entities.Product;
import com.echocode.project.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Product product) {
        if(!productRepository.existsById(product.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");

        return productRepository.save(product);
    }
}
