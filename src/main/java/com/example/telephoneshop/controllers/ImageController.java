package com.example.telephoneshop.controllers;

import com.example.telephoneshop.entity.Image;
import com.example.telephoneshop.repository.ImageRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("images") // URL будет /images/...
@AllArgsConstructor
public class ImageController {

    private final ImageRepository imageRepository;

    @GetMapping("{id}") // Например: /images/123
    public ResponseEntity<?> getImageById(@PathVariable Long id) {
        Optional<Image> imageOpt = imageRepository.findById(id);
        if (imageOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Image image = imageOpt.get();
        byte[] imageBytes = image.getBytes();

        // Определяем тип контента (чтобы браузер понял, что это картинка)
        MediaType imageType = MediaType.IMAGE_JPEG; // По умолчанию
        String imageName = image.getName().toLowerCase();

        if (imageName.endsWith(".png")) {
            imageType = MediaType.IMAGE_PNG;
        } else if (imageName.endsWith(".gif")) {
            imageType = MediaType.IMAGE_GIF;
        }
        // ... можно добавить другие типы

        // Возвращаем ответ:
        // 1. Статус 200 OK
        // 2. Тип контента (image/jpeg, image/png...)
        // 3. Сами байты картинки в теле ответа
        return ResponseEntity.ok()
                .contentType(imageType)
                .body(imageBytes);
    }
}