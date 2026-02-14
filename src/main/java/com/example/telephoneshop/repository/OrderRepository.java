package com.example.telephoneshop.repository;

import com.example.telephoneshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> { // Используем Long вместо Integer
    List<Order> findByStatus(String status);
}