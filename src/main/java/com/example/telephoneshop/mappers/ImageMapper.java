package com.example.telephoneshop.mappers;

import com.example.telephoneshop.entity.Image;
import com.example.telephoneshop.repository.ImageRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ImageMapper {
    ImageRepository imageRepository;

    public Image fileToImages(MultipartFile file1) throws IOException {
        Image image = new Image();
        image.setName(file1.getOriginalFilename());
        image.setSize(file1.getSize());
        image.setBytes(file1.getBytes());
        return image;
    }
}
