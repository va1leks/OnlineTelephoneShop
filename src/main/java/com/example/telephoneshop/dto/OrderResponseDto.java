package com.example.telephoneshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto {
    private long id;
    private String phoneNumber;
    private String address;
    private String fullName;
    private String status;
    private List<SimpleTelephoneDto> telephones;
}