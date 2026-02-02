package com.ecom.productcatalog.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "category") // CRITICAL: Prevents circular loop
@ToString(exclude = "category")          // Prevents loop during logging
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String imageUrl;
    private Double price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    // Helper getter for JSON serialization
    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }
}