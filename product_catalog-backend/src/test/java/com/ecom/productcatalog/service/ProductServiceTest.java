package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Category;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.CategoryRepository;
import com.ecom.productcatalog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Luxury Apparel");

        testProduct = new Product();
        testProduct.setId(101L);
        testProduct.setName("Tailored Wool Coat");
        testProduct.setDescription("Pure Italian virgin wool outerwear");
        testProduct.setPrice(new BigDecimal("12499.00"));
        testProduct.setImageUrl("https://example.com/coat.jpg");
        testProduct.setCategory(testCategory);
        testProduct.setStockQuantity(25);
    }

    @Test
    @DisplayName("getAllProducts() should return all active products from repository")
    void testGetAllProducts() {
        Product p2 = new Product();
        p2.setId(102L);
        p2.setName("Silk Evening Shirt");
        p2.setPrice(new BigDecimal("4999.00"));

        when(productRepository.findAll()).thenReturn(Arrays.asList(testProduct, p2));

        List<Product> result = productService.getAllProducts();

        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Tailored Wool Coat");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getProductById() should return product when product exists")
    void testGetProductById_Found() {
        when(productRepository.findById(101L)).thenReturn(Optional.of(testProduct));

        Product result = productService.getProductById(101L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(101L);
        assertThat(result.getPrice()).isEqualByComparingTo("12499.00");
        verify(productRepository, times(1)).findById(101L);
    }

    @Test
    @DisplayName("getProductById() should return null when product is not found")
    void testGetProductById_NotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Product result = productService.getProductById(999L);

        assertThat(result).isNull();
        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("getProductByCategory() should query repository by category ID")
    void testGetProductByCategory() {
        when(productRepository.findByCategory_Id(1L)).thenReturn(List.of(testProduct));

        List<Product> result = productService.getProductByCategory(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategory().getId()).isEqualTo(1L);
        verify(productRepository, times(1)).findByCategory_Id(1L);
    }

    @Test
    @DisplayName("saveProduct() should link category and save product")
    void testSaveProduct_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product result = productService.saveProduct(testProduct);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Tailored Wool Coat");
        verify(categoryRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    @DisplayName("saveProduct() should throw RuntimeException when category ID is invalid")
    void testSaveProduct_CategoryNotFound() {
        Category invalidCat = new Category();
        invalidCat.setId(999L);
        testProduct.setCategory(invalidCat);

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.saveProduct(testProduct))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Category not found");

        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateProduct() should update fields and save existing product")
    void testUpdateProduct_Success() {
        Product updatePayload = new Product();
        updatePayload.setName("Updated Coat");
        updatePayload.setDescription("Updated description");
        updatePayload.setPrice(new BigDecimal("13999.00"));
        updatePayload.setImageUrl("https://example.com/new.jpg");
        updatePayload.setCategory(testCategory);

        when(productRepository.findById(101L)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.updateProduct(101L, updatePayload);

        assertThat(result.getName()).isEqualTo("Updated Coat");
        assertThat(result.getPrice()).isEqualByComparingTo("13999.00");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("deleteProduct() should invoke repository deleteById")
    void testDeleteProduct() {
        doNothing().when(productRepository).deleteById(101L);

        productService.deleteProduct(101L);

        verify(productRepository, times(1)).deleteById(101L);
    }
}
