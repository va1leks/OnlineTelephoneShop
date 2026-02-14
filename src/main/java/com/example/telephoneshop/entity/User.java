package com.example.telephoneshop.entity;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Setter
@Getter
public class User {
    protected String phone;
    protected String email;
    protected String password;
    protected String status;
}
