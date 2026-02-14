package com.example.telephoneshop.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    String phoneNumber;
    String address;
    String fullName;
    String status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "order_telephone",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "telephone_id")
    )
    @JsonIgnoreProperties({"images", "availableTelephones", "telephone"})
    List<Telephone> telephones;

}
