package com.example.telephoneshop.controllers;

import com.example.telephoneshop.entity.Telephone;
import com.example.telephoneshop.service.TelephoneService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("telshop/telephones")
public class TelephoneController {

    public TelephoneService telephoneService;

    @GetMapping("all")
    public List<Telephone> GetAllTelephones(){
        return telephoneService.GetAllTelephones();
    }

    @PostMapping(value = "create", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Telephone CreateTelephone(@RequestPart("telephone") Telephone telephone,
                                     @RequestPart(value = "file1", required = false) MultipartFile file1,
                                     @RequestPart(value = "file2", required = false) MultipartFile file2){
        return telephoneService.CreateTelephone(telephone, file1, file2);
    }

    @GetMapping("/{id}")
    public Telephone GetTelephoneById(@PathVariable long id){
        return telephoneService.GetTelephoneById(id);
    }

    @GetMapping("/filter")
    public List<Telephone> GetAllTelephonesByFilter(
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) String storage,
            @RequestParam(required = false) String processor,
            @RequestParam(required = false) String searchTerm) {
        return telephoneService.GetAllTelephonesByFilter(model,brand,color,status,price,storage,processor,searchTerm);
    }

    // Основной метод для обновления с изображениями
    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Telephone UpdateTelephone(@PathVariable long id,
                                     @RequestPart("telephone") Telephone telephone,
                                     @RequestPart(value = "file1", required = false) MultipartFile file1,
                                     @RequestPart(value = "file2", required = false) MultipartFile file2) {
        return telephoneService.UpdateTelephone(telephone, id, file1, file2);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> DeleteTelephone(@PathVariable long id) {
        try {
            telephoneService.DeleteTelephone(id);
            return ResponseEntity.ok().body("Телефон успешно удален");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}