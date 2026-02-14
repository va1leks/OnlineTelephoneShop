package com.example.telephoneshop.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "telephone")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Telephone {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;
    String model;
    String brand;
    String color;
    String description;
    Double price;
    String size;
    Double weight;
    String display;
    String camera;
    String storage;
    String connection;
    String processor;
    String status;

    @OneToMany(mappedBy = "telephone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<AvailableTelephone> availableTelephones;

    @OneToMany(mappedBy = "telephone",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    Set<Image> images = new java.util.HashSet<>();
  }
