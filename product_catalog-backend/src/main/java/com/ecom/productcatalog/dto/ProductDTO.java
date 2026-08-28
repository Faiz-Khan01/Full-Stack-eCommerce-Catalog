package com.ecom.productcatalog.dto;

import lombok.Data;
import java.math.BigDecimal; // Import BigDecimal

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Long categoryId;
    private String categoryName;

    public ProductDTO(Long id, String name, String description, String imageUrl, BigDecimal price, Long categoryId, String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}