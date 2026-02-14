package com.example.telephoneshop.service;

import com.example.telephoneshop.entity.AvailableTelephone;
import com.example.telephoneshop.entity.Order;

import java.util.List;

public interface AvailableTelephoneService {
    public List<AvailableTelephone> getAllOrders();
    public AvailableTelephone createOrder(AvailableTelephone availableTelephone);
}
