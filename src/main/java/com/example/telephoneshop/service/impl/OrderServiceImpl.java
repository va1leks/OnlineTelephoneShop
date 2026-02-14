package com.example.telephoneshop.service.impl;

import com.example.telephoneshop.dto.OrderDto;
import com.example.telephoneshop.dto.OrderResponseDto;
import com.example.telephoneshop.dto.SimpleTelephoneDto;
import com.example.telephoneshop.entity.Order;
import com.example.telephoneshop.entity.Telephone;
import com.example.telephoneshop.repository.OrderRepository;
import com.example.telephoneshop.repository.TelephoneRepository;
import com.example.telephoneshop.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    final OrderRepository orderRepository;
    final TelephoneRepository telephoneRepository;

    // Используем специальный метод для получения заказов без LOB проблем
    @Override
    @Transactional
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        for (Order order : orders) {
            if (order.getTelephones() != null) {
                for (Telephone telephone : order.getTelephones()) {
                    telephone.getModel();
                    telephone.getBrand();
                }
            }
        }
        return orders;
    }

    // DTO метод для получения всех заказов
    @Transactional
    public List<OrderResponseDto> getAllOrdersDto() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToOrderResponseDto)
                .collect(Collectors.toList());
    }

    // Новый DTO метод для обновления статуса
    @Transactional
    public OrderResponseDto updateOrderStatusDto(Long id, String status) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        List<String> validStatuses = List.of("Pending", "Processing", "Shipped", "Delivered", "Cancelled");
        if (!validStatuses.contains(status)) {
            throw new RuntimeException("Invalid status. Allowed values: " + validStatuses);
        }

        existingOrder.setStatus(status);
        Order updatedOrder = orderRepository.save(existingOrder);

        return convertToOrderResponseDto(updatedOrder);
    }

    // DTO метод для получения заказов по статусу
    @Transactional
    public List<OrderResponseDto> getOrdersByStatusDto(String status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return orders.stream()
                .map(this::convertToOrderResponseDto)
                .collect(Collectors.toList());
    }

    // DTO метод для получения заказа по ID
    @Transactional
    public OrderResponseDto getOrderByIdDto(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToOrderResponseDto(order);
    }

    private OrderResponseDto convertToOrderResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setAddress(order.getAddress());
        dto.setFullName(order.getFullName());
        dto.setStatus(order.getStatus());

        if (order.getTelephones() != null) {
            List<SimpleTelephoneDto> telephoneDtos = order.getTelephones().stream()
                    .map(this::convertToSimpleTelephoneDto)
                    .collect(Collectors.toList());
            dto.setTelephones(telephoneDtos);
        }

        return dto;
    }

    private SimpleTelephoneDto convertToSimpleTelephoneDto(Telephone telephone) {
        SimpleTelephoneDto dto = new SimpleTelephoneDto();
        dto.setId(telephone.getId());
        dto.setModel(telephone.getModel());
        dto.setBrand(telephone.getBrand());
        dto.setColor(telephone.getColor());
        dto.setDescription(telephone.getDescription());
        dto.setPrice(telephone.getPrice());
        dto.setSize(telephone.getSize());
        dto.setWeight(telephone.getWeight());
        dto.setDisplay(telephone.getDisplay());
        dto.setCamera(telephone.getCamera());
        dto.setStorage(telephone.getStorage());
        dto.setConnection(telephone.getConnection());
        dto.setProcessor(telephone.getProcessor());
        dto.setStatus(telephone.getStatus());
        return dto;
    }

    // Остальные методы...
    @Override
    @Transactional
    public Order createOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setPhoneNumber(orderDto.getPhoneNumber());
        order.setAddress(orderDto.getAddress());
        order.setFullName(orderDto.getFullName());
        order.setStatus("Pending");

        List<Telephone> telephones = orderDto.getTelephoneIds().stream()
                .map(telephoneId -> telephoneRepository.findById(telephoneId)
                        .orElseThrow(() -> new RuntimeException("Telephone not found with id: " + telephoneId)))
                .collect(Collectors.toList());

        order.setTelephones(telephones);
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    @Transactional
    public Order updateOrder(long id, OrderDto orderDto) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        if (orderDto.getPhoneNumber() != null) {
            existingOrder.setPhoneNumber(orderDto.getPhoneNumber());
        }
        if (orderDto.getAddress() != null) {
            existingOrder.setAddress(orderDto.getAddress());
        }
        if (orderDto.getFullName() != null) {
            existingOrder.setFullName(orderDto.getFullName());
        }
        if (orderDto.getStatus() != null) {
            existingOrder.setStatus(orderDto.getStatus());
        }

        if (orderDto.getTelephoneIds() != null && !orderDto.getTelephoneIds().isEmpty()) {
            List<Telephone> telephones = orderDto.getTelephoneIds().stream()
                    .map(telephoneId -> telephoneRepository.findById(telephoneId)
                            .orElseThrow(() -> new RuntimeException("Telephone not found with id: " + telephoneId)))
                    .collect(Collectors.toList());
            existingOrder.setTelephones(telephones);
        }

        return orderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(long id, String status) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        List<String> validStatuses = List.of("Pending", "Processing", "Shipped", "Delivered", "Cancelled");
        if (!validStatuses.contains(status)) {
            throw new RuntimeException("Invalid status. Allowed values: " + validStatuses);
        }

        existingOrder.setStatus(status);
        return orderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
}