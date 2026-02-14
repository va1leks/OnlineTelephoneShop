package com.example.telephoneshop.service;

import com.example.telephoneshop.entity.Telephone;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TelephoneService {

    public Telephone CreateTelephone(Telephone telephone, MultipartFile file1, MultipartFile file2);

    public List<Telephone> GetAllTelephones();

    public Telephone GetTelephoneById(long id);

    public List<Telephone> GetAllTelephonesByFilter(Telephone filter);

    public List<Telephone> GetAllTelephonesByFilter(String model, String brand, String color, String status,
                                                    Double price, String storage, String processor, String searchTerm);

    public Telephone EditTelephone(Telephone telephone,long id);

    public void DeleteTelephone(long id);

    public Telephone UpdateTelephone(Telephone telephone,long id,MultipartFile file1, MultipartFile file2);
}
