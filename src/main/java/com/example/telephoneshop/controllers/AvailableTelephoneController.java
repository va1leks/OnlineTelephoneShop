package com.example.telephoneshop.controllers;


import com.example.telephoneshop.service.AvailableTelephoneService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("telshop/stats")
public class AvailableTelephoneController {
    public AvailableTelephoneService availableTelephoneService;
}
