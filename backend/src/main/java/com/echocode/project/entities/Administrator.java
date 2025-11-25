package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.time.LocalDateTime;
import java.util.Date;

@Entity
@SuperBuilder
@Getter @Setter
@NoArgsConstructor
@DiscriminatorValue("ADMIN")
public class Administrator extends User
{
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.setRole(Role.ADMIN);
        this.createdAt = LocalDateTime.now();
    }
}
