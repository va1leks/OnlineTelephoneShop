package com.example.telephoneshop.repository;

import com.example.telephoneshop.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
