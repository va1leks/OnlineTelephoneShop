package com.example.telephoneshop.service.impl;

import com.example.telephoneshop.entity.AvailableTelephone;
import com.example.telephoneshop.entity.Image;
import com.example.telephoneshop.entity.Telephone;
import com.example.telephoneshop.mappers.ImageMapper;
import com.example.telephoneshop.repository.ImageRepository;
import com.example.telephoneshop.repository.TelephoneRepository;
import com.example.telephoneshop.service.TelephoneService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class TelephoneServiceImpl implements TelephoneService {

    final TelephoneRepository telephoneRepository;
    final ImageMapper imageMapper;
    final ImageRepository imageRepository;

    @SneakyThrows
    @Override
    @Transactional
    public Telephone CreateTelephone(Telephone telephone, MultipartFile file1, MultipartFile file2){
        Image image1;
        Image image2;

        if(file1 != null && file1.getSize() != 0){
            image1 = imageMapper.fileToImages(file1);
            image1.setPreviewImage(true);
            image1.setTelephone(telephone);
            telephone.getImages().add(image1);
        }
        if(file2 != null && file2.getSize() != 0){
            image2 = imageMapper.fileToImages(file2);
            image2.setPreviewImage(false);
            image2.setTelephone(telephone);
            telephone.getImages().add(image2);
        }
        telephoneRepository.save(telephone);
        return telephone;
    }

    // НОВЫЙ метод для обновления с изображениями
    @SneakyThrows
    @Override
    @Transactional
    public Telephone UpdateTelephone(Telephone updatedTelephone, long id, MultipartFile file1, MultipartFile file2) {
        Optional<Telephone> existingTelephoneOpt = telephoneRepository.findById(id);

        if (existingTelephoneOpt.isEmpty()) {
            throw new RuntimeException("Телефон с ID " + id + " не найден");
        }

        Telephone existingTelephone = existingTelephoneOpt.get();

        // Обновляем поля
        updateTelephoneFields(existingTelephone, updatedTelephone);

        // Обрабатываем изображения если они переданы
        if (file1 != null && file1.getSize() != 0) {
            // Удаляем старое основное изображение
            existingTelephone.getImages().removeIf(Image::isPreviewImage);

            // Добавляем новое основное изображение
            Image image1 = imageMapper.fileToImages(file1);
            image1.setPreviewImage(true);
            image1.setTelephone(existingTelephone);
            existingTelephone.getImages().add(image1);
        }

        if (file2 != null && file2.getSize() != 0) {
            // Удаляем старое дополнительное изображение
            existingTelephone.getImages().removeIf(img -> !img.isPreviewImage());

            // Добавляем новое дополнительное изображение
            Image image2 = imageMapper.fileToImages(file2);
            image2.setPreviewImage(false);
            image2.setTelephone(existingTelephone);
            existingTelephone.getImages().add(image2);
        }

        return telephoneRepository.save(existingTelephone);
    }

    // Вспомогательный метод для обновления полей
    private void updateTelephoneFields(Telephone existing, Telephone updated) {
        if (updated.getModel() != null) {
            existing.setModel(updated.getModel());
        }
        if (updated.getBrand() != null) {
            existing.setBrand(updated.getBrand());
        }
        if (updated.getColor() != null) {
            existing.setColor(updated.getColor());
        }
        if (updated.getDescription() != null) {
            existing.setDescription(updated.getDescription());
        }
        if (updated.getPrice() != null) {
            existing.setPrice(updated.getPrice());
        }
        if (updated.getSize() != null) {
            existing.setSize(updated.getSize());
        }
        if (updated.getWeight() != null) {
            existing.setWeight(updated.getWeight());
        }
        if (updated.getDisplay() != null) {
            existing.setDisplay(updated.getDisplay());
        }
        if (updated.getCamera() != null) {
            existing.setCamera(updated.getCamera());
        }
        if (updated.getStorage() != null) {
            existing.setStorage(updated.getStorage());
        }
        if (updated.getConnection() != null) {
            existing.setConnection(updated.getConnection());
        }
        if (updated.getProcessor() != null) {
            existing.setProcessor(updated.getProcessor());
        }
        if (updated.getStatus() != null) {
            existing.setStatus(updated.getStatus());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Telephone> GetAllTelephones() {
        return telephoneRepository.findAll();
    }

    public Telephone GetTelephoneById(long id) {
        return telephoneRepository.findById(id).get();
    }

    @Override
    public List<Telephone> GetAllTelephonesByFilter(Telephone filter) {
        List<Telephone> telephones = telephoneRepository.findAll();

        return telephones.stream()
                .filter(t -> filter.getModel() == null || t.getModel().equalsIgnoreCase(filter.getModel()))
                .filter(t -> filter.getBrand() == null || t.getBrand().equalsIgnoreCase(filter.getBrand()))
                .filter(t -> filter.getColor() == null || t.getColor().equalsIgnoreCase(filter.getColor()))
                .filter(t -> filter.getStatus() == null || t.getStatus().equalsIgnoreCase(filter.getStatus()))
                .filter(t -> filter.getPrice() == null || t.getPrice() <= filter.getPrice())
                .filter(t -> filter.getStorage() == null || t.getStorage().equalsIgnoreCase(filter.getStorage()))
                .filter(t -> filter.getProcessor() == null || t.getProcessor().equalsIgnoreCase(filter.getProcessor()))
                .toList();
    }

    @Override
    public List<Telephone> GetAllTelephonesByFilter(String model, String brand, String color, String status, Double price, String storage, String processor, String searchTerm) {
        Telephone filter = new Telephone();
        filter.setModel(model);
        filter.setBrand(brand);
        filter.setColor(color);
        filter.setStatus(status);
        filter.setPrice(price);
        filter.setStorage(storage);
        filter.setProcessor(processor);

        List<Telephone> filteredList = GetAllTelephonesByFilter(filter);
        if (searchTerm != null && !searchTerm.isEmpty()) {
            String lowerSearch = searchTerm.toLowerCase();
            return filteredList.stream()
                    .filter(t ->
                            (t.getModel() != null && t.getModel().toLowerCase().contains(lowerSearch)) ||
                                    (t.getBrand() != null && t.getBrand().toLowerCase().contains(lowerSearch)) ||
                                    (t.getDescription() != null && t.getDescription().toLowerCase().contains(lowerSearch))
                    )
                    .toList();
        }
        return filteredList;
    }

    @Override
    @Transactional
    public Telephone EditTelephone(Telephone updatedTelephone, long id) {
        Optional<Telephone> existingTelephoneOpt = telephoneRepository.findById(id);

        if (existingTelephoneOpt.isEmpty()) {
            throw new RuntimeException("Телефон с ID " + id + " не найден");
        }

        Telephone existingTelephone = existingTelephoneOpt.get();
        updateTelephoneFields(existingTelephone, updatedTelephone);

        return telephoneRepository.save(existingTelephone);
    }

    @Override
    @Transactional
    public void DeleteTelephone(long id) {
        Optional<Telephone> telephoneOpt = telephoneRepository.findById(id);

        if (telephoneOpt.isEmpty()) {
            throw new RuntimeException("Телефон с ID " + id + " не найден");
        }

        Telephone telephone = telephoneOpt.get();

        // Если есть связанные изображения, удаляем их сначала
        if (telephone.getImages() != null && !telephone.getImages().isEmpty()) {
            imageRepository.deleteAll(telephone.getImages());
        }

        // Удаляем сам телефон
        telephoneRepository.delete(telephone);
    }
}