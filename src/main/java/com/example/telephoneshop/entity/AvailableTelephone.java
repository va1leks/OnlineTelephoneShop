package com.example.telephoneshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Optional;

@Entity
@Table(name = "available_telephone")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AvailableTelephone {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "telephone_id")
    @JsonBackReference
    Telephone telephone;

    Long serialNumber;
    String status;

    public AvailableTelephone(Long id, Optional<Telephone> byId, Long serialNumber, String status) {
        this.id = id;
        this.telephone = byId.orElse(null);
        this.serialNumber = serialNumber;
        this.status = status;
    }

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)

    Order currentOrder;
}
