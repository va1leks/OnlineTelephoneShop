package com.example.telephoneshop.mappers;

import com.example.telephoneshop.dto.AvailableTelephoneDto;
import com.example.telephoneshop.entity.AvailableTelephone;
import com.example.telephoneshop.repository.TelephoneRepository;

public class AvailableTelephoneMapper {

    TelephoneRepository telephoneRepository;

    public AvailableTelephone AvailableTelephoneDtoToEntity(
            AvailableTelephoneDto availableTelephoneDto) {
        return new AvailableTelephone(availableTelephoneDto.getId(),
                telephoneRepository.findById(availableTelephoneDto.getTelephoneId()),
                availableTelephoneDto.getSerialNumber(),
                availableTelephoneDto.getStatus());
    }

    public AvailableTelephoneDto EntityToAvailableTelephoneDto(
            AvailableTelephone availableTelephone) {
        return new AvailableTelephoneDto(availableTelephone.getId(),
                availableTelephone.getTelephone().getId(),
                availableTelephone.getSerialNumber(),
                availableTelephone.getStatus());
    }
}
