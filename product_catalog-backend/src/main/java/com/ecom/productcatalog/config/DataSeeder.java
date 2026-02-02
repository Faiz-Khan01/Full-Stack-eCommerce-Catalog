package com.ecom.productcatalog.config;

import com.ecom.productcatalog.model.Category;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.CategoryRepository;
import com.ecom.productcatalog.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Clear All existing data
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        // 2. Create Categories
        Category electronics = new Category();
        electronics.setName("Electronics");

        Category clothing = new Category();
        clothing.setName("Clothing");

        Category accessories = new Category();
        accessories.setName("Accessories");

        Category home = new Category();
        home.setName("Home & Kitchen");

        List<Category> savedCategories = categoryRepository.saveAll(Arrays.asList(electronics, clothing, accessories, home));

        Category savedElectronics = savedCategories.get(0);
        Category savedClothing = savedCategories.get(1);
        Category savedAccessories = savedCategories.get(2);
        Category savedHome = savedCategories.get(3);

        // 3. Create Products - MATCHING YOUR FILENAMES EXACTLY (.png and Capitals)
        Product phone = new Product();
        phone.setName("SmartPhone");
        phone.setDescription("Latest model smartphone with amazing latest features");
        phone.setImageUrl("/images/Smart Phone.png");
        phone.setPrice(699.99);
        phone.setCategory(savedElectronics);

        Product laptop = new Product();
        laptop.setName("Laptop");
        laptop.setDescription("High performance laptop for work and play");
        laptop.setImageUrl("/images/Laptop.png");
        laptop.setPrice(999.99);
        laptop.setCategory(savedElectronics);

        Product jacket = new Product();
        jacket.setName("Winter Jacket");
        jacket.setDescription("Warm and cozy jacket for winter");
        jacket.setImageUrl("/images/Winter Jacket.png");
        jacket.setPrice(129.99);
        jacket.setCategory(savedClothing);

        Product tshirt = new Product();
        tshirt.setName("Graphic T-Shirt");
        tshirt.setDescription("Comfortable cotton t-shirt with trendy print");
        tshirt.setImageUrl("/images/T-Shirt.png");
        tshirt.setPrice(19.99);
        tshirt.setCategory(savedClothing);

        Product belt = new Product();
        belt.setName("Leather Belt");
        belt.setDescription("High-quality leather belt for all occasions");
        belt.setImageUrl("/images/Leather Belt.png");
        belt.setPrice(29.99);
        belt.setCategory(savedAccessories);

        Product sunglass = new Product();
        sunglass.setName("Sunglass");
        sunglass.setDescription("Trendy sunglasses to protect your eyes");
        sunglass.setImageUrl("/images/Sunglass.png");
        sunglass.setPrice(99.99);
        sunglass.setCategory(savedAccessories);

        Product blender = new Product();
        blender.setName("Kitchen Blender");
        blender.setDescription("High-speed blender for smoothies");
        blender.setImageUrl("/images/Kitchen Blender.png");
        blender.setPrice(149.99);
        blender.setCategory(savedHome);

        Product vacuum = new Product();
        vacuum.setName("Robot Vacuum Cleaner");
        vacuum.setDescription("Smart vacuum cleaner with automatic scheduling");
        vacuum.setImageUrl("/images/Robot Vacuum Cleaner.png");
        vacuum.setPrice(499.99);
        vacuum.setCategory(savedHome);

        // 4. Save all products
        productRepository.saveAll(Arrays.asList(phone, laptop, jacket, tshirt, belt, sunglass, blender, vacuum));

        System.out.println("Data Seeding Completed Successfully with local  images!");
    }
}