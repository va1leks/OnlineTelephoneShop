package com.example.telephoneshop.controllers;

import com.example.telephoneshop.dto.OrderDto;
import com.example.telephoneshop.dto.OrderResponseDto;
import com.example.telephoneshop.dto.SimpleTelephoneDto;
import com.example.telephoneshop.entity.Order;
import com.example.telephoneshop.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("telshop/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto) {
        try {
            Order order = orderService.createOrder(orderDto);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            // Пробуем получить через DTO
            if (orderService instanceof com.example.telephoneshop.service.impl.OrderServiceImpl) {
                List<OrderResponseDto> orders = ((com.example.telephoneshop.service.impl.OrderServiceImpl) orderService).getAllOrdersDto();
                return ResponseEntity.ok(orders);
            }
            // Если не получилось, используем обычный метод
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error loading orders: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable long id, @RequestBody OrderDto orderDto) {
        try {
            Order order = orderService.updateOrder(id, orderDto);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating order: " + e.getMessage());
        }
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            // Используем DTO метод для обновления статуса
            if (orderService instanceof com.example.telephoneshop.service.impl.OrderServiceImpl) {
                OrderResponseDto orderDto = ((com.example.telephoneshop.service.impl.OrderServiceImpl) orderService).updateOrderStatusDto(id, status);
                return ResponseEntity.ok(orderDto);
            }

            // Fallback на обычный метод
            Order order = orderService.updateOrderStatus(id, status);
            OrderResponseDto orderDto = convertToOrderResponseDto(order);
            return ResponseEntity.ok(orderDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating order status: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable long id) {
        try {
            orderService.deleteOrder(id);

            // Возвращаем простой JSON ответ
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order deleted successfully");
            response.put("deletedId", id);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error deleting order: " + e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            if (orderService instanceof com.example.telephoneshop.service.impl.OrderServiceImpl) {
                List<OrderResponseDto> orders = ((com.example.telephoneshop.service.impl.OrderServiceImpl) orderService).getOrdersByStatusDto(status);
                return ResponseEntity.ok(orders);
            }

            List<Order> orders = orderService.getOrdersByStatus(status);
            List<OrderResponseDto> orderDtos = orders.stream()
                    .map(this::convertToOrderResponseDto)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(orderDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error loading orders by status: " + e.getMessage());
        }
    }

    // Вспомогательный метод для конвертации Order в OrderResponseDto
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
                    .collect(java.util.stream.Collectors.toList());
            dto.setTelephones(telephoneDtos);
        }

        return dto;
    }

    private SimpleTelephoneDto convertToSimpleTelephoneDto(com.example.telephoneshop.entity.Telephone telephone) {
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
}