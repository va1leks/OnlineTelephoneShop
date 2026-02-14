package com.example.telephoneshop.repository;

import com.example.telephoneshop.entity.Telephone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TelephoneRepository extends JpaRepository<Telephone, Long> {

}
