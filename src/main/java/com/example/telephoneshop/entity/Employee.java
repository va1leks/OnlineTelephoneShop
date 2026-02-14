package com.example.telephoneshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employee")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Employee extends User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;
    String fullName;
}
