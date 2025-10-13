package com.echocode.project.controllers;

import com.echocode.project.entities.Creation;
import com.echocode.project.services.CreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/creations")
public class CreationController {

    @Autowired
    CreationService creationService;

    @GetMapping
    public List<Creation> getAllCreations() {
        return creationService.getAllCreations();
    }

    @GetMapping("/{id}")
    public Creation getCreationByCreationId(@PathVariable int id){
        try{
            return creationService.getCreationById(id);
        }catch (Exception ex){

        }
    }

    @GetMapping("/client/{id}")
    public List<Creation> getCreationByClientId(@PathVariable int id){
        return creationService.getAllCreationsFromClient(id);
    }
}
