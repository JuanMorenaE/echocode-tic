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
@Table(name = "administrators")
public class Administrator extends User
{
    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
