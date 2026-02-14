package com.example.telephoneshop.mappers;

import com.example.telephoneshop.dto.ClientDto;
import com.example.telephoneshop.entity.Client;
import com.example.telephoneshop.repository.ClientRepository;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    ClientRepository clientRepository;

    public ClientDto ClientToClientDto(Client client) {
        ClientDto clientDto = new ClientDto(client.getId(), client.getPhone(),
                client.getEmail(),client.getPassword());
        return clientDto;
    }

    public Client ClientDtoToClient(ClientDto clientDto) {
        Client client = new Client();
        client.setPhone(clientDto.getPhone());
        client.setEmail(clientDto.getEmail());
        client.setPassword(clientDto.getPassword());
        client.setId(clientDto.getId());
        client.setStatus("USER");
        return client;
    }
}
