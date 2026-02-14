package com.example.telephoneshop.service;

import com.example.telephoneshop.dto.ClientDto;
import com.example.telephoneshop.entity.Client;
import com.example.telephoneshop.entity.Telephone;

import java.util.List;
import java.util.Optional;

public interface ClientService {

    public Optional<Client> GetClientById(long id);

    public Client AddTelephoneToCart(long clientId, long telephoneId);

    public List<Client> getAllClients();

    public Client CreateClient(ClientDto client);

    public List<Telephone> GetTelephonesFromCart(long ClientId);
}
