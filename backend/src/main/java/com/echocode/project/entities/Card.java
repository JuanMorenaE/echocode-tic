package com.echocode.project.entities;

import lombok.*;

import java.util.Date;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Card {
    private String number;
    private Date expirationDate;
    private short cvv;
}
