package com.echocode.project.repositories;

import com.echocode.project.entities.Creation;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreationRepository extends JpaRepository<Creation, Integer> {
    public Creation getCreationByCreationId(@NonNull Integer creationId);

    public List<Creation> findAllByOwner_UserId(@NonNull Long ownerId);

    public boolean existsByCreationId(@NonNull Integer creationId);
}
