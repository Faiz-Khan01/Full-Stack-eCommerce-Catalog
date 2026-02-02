package com.ecom.productcatalog.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Double price;
    private Long categoryId;
    private String categoryName;

    public ProductDTO(Long id, String name, String description, String imageUrl, Double price, Long categoryId, String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}
