package com.example.telephoneshop.service.impl;

import com.example.telephoneshop.entity.AvailableTelephone;
import com.example.telephoneshop.entity.Order;
import com.example.telephoneshop.repository.AvailableTelephoneRepository;
import com.example.telephoneshop.service.AvailableTelephoneService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class AvailableTelephoneServiceImpl implements AvailableTelephoneService {
    final AvailableTelephoneRepository availableTelephoneRepository;


    @Override
    public List<AvailableTelephone> getAllOrders() {
        return availableTelephoneRepository.findAll();
    }

    @Override
    public AvailableTelephone createOrder(AvailableTelephone availableTelephone) {
        return availableTelephoneRepository.save(availableTelephone);
    }
}
