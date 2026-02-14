package com.example.telephoneshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ClientDto {
    long id;
    String phone;
    String email;
    String password;
}
