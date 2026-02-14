package com.example.telephoneshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class AvailableTelephoneDto {

    Long id;
    Long telephoneId;
    Long serialNumber;
    String status;
}
