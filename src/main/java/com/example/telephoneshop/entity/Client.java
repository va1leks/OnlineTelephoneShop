package com.example.telephoneshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "client")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Client extends User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Telephone> cart;

    public Client addTelephoneToCart(Telephone telephone){
        cart.add(telephone);
        return this;
    }
}
