package com.example.telephoneshop.service;

import com.example.telephoneshop.dto.OrderDto;
import com.example.telephoneshop.entity.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(OrderDto orderDto);
    List<Order> getAllOrders();
    Order getOrderById(long id);
    Order updateOrder(long id, OrderDto orderDto);
    Order updateOrderStatus(long id, String status);
    void deleteOrder(long id);
    List<Order> getOrdersByStatus(String status);
}