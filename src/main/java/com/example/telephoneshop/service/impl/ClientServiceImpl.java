package com.example.telephoneshop.service.impl;

import com.example.telephoneshop.dto.ClientDto;
import com.example.telephoneshop.entity.Client;
import com.example.telephoneshop.entity.Telephone;
import com.example.telephoneshop.mappers.ClientMapper;
import com.example.telephoneshop.repository.ClientRepository;
import com.example.telephoneshop.repository.TelephoneRepository;
import com.example.telephoneshop.service.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClientServiceImpl implements ClientService {

    ClientRepository clientRepository;
    TelephoneRepository telephoneRepository;
    ClientMapper clientMapper;


    @Override
    public Optional<Client> GetClientById(long id) {
        return clientRepository.findById(id);
    }

    @Override
    public Client AddTelephoneToCart(long clientId, long telephoneId) {
        Optional<Client> client = clientRepository.findById(clientId);
        Optional<Telephone> telephone = telephoneRepository.findById(telephoneId);
        return client.get().addTelephoneToCart(telephone.get());
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client CreateClient(ClientDto client) {
        return  clientRepository.save(clientMapper.ClientDtoToClient(client));
    }

    @Override
    public List<Telephone> GetTelephonesFromCart(long ClientId) {
        return clientRepository.findById(ClientId).get().getCart();
    }
}
