package com.example.telephoneshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleTelephoneDto {
    private long id;
    private String model;
    private String brand;
    private String color;
    private String description;
    private Double price;
    private String size;
    private Double weight;
    private String display;
    private String camera;
    private String storage;
    private String connection;
    private String processor;
    private String status;
}