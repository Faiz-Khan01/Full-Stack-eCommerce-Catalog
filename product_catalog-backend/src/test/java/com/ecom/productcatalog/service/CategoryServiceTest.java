package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Category;
import com.ecom.productcatalog.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category cat1;
    private Category cat2;

    @BeforeEach
    void setUp() {
        cat1 = new Category();
        cat1.setId(1L);
        cat1.setName("Footwear & Shoes");

        cat2 = new Category();
        cat2.setId(2L);
        cat2.setName("Fragrances & Perfumes");
    }

    @Test
    @DisplayName("getAllCategories() should return all categories")
    void testGetAllCategories() {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(cat1, cat2));

        List<Category> list = categoryService.getAllCategories();

        assertThat(list).hasSize(2);
        assertThat(list.get(0).getName()).isEqualTo("Footwear & Shoes");
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getCategoryById() should return category when found")
    void testGetCategoryById_Found() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat1));

        Category result = categoryService.getCategoryById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Footwear & Shoes");
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getCategoryById() should throw exception when category does not exist")
    void testGetCategoryById_NotFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getCategoryById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Category not found with id: 99");

        verify(categoryRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("saveCategory() should save and return entity")
    void testSaveCategory() {
        when(categoryRepository.save(any(Category.class))).thenReturn(cat1);

        Category result = categoryService.saveCategory(cat1);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Footwear & Shoes");
        verify(categoryRepository, times(1)).save(cat1);
    }

    @Test
    @DisplayName("updateCategory() should update name and return updated category")
    void testUpdateCategory_Success() {
        Category updateData = new Category();
        updateData.setName("Luxury Footwear");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat1));
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

        Category result = categoryService.updateCategory(1L, updateData);

        assertThat(result.getName()).isEqualTo("Luxury Footwear");
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("deleteCategory() should delegate to repository deleteById")
    void testDeleteCategory() {
        doNothing().when(categoryRepository).deleteById(1L);

        categoryService.deleteCategory(1L);

        verify(categoryRepository, times(1)).deleteById(1L);
    }
}
