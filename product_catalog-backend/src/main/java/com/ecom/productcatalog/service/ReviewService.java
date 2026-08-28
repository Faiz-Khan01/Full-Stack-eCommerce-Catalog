package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.ReviewDTO;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.model.Review;
import com.ecom.productcatalog.repository.ProductRepository;
import com.ecom.productcatalog.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    public ReviewDTO addReview(ReviewDTO reviewDTO) {
        if (reviewDTO.getProductId() == null) {
            throw new RuntimeException("Product ID cannot be null");
        }

        Product product = productRepository.findById(reviewDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + reviewDTO.getProductId()));

        Review review = new Review();
        review.setProduct(product);
        review.setUserName(reviewDTO.getUserName());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUserId(reviewDTO.getUserId());

        reviewRepository.save(review);

        // Recalculate and update product's average rating
        List<Review> productReviews = reviewRepository.findByProductId(product.getId());
        double avgRating = productReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        product.setAverageRating(avgRating);
        productRepository.save(product);

        ReviewDTO responseDTO = convertToDTO(review);
        responseDTO.setProductId(product.getId());
        responseDTO.setAverageRating(avgRating);
        return responseDTO;
    }

    public List<ReviewDTO> getReviewsByProduct(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        double currentAvgRating = (product != null && product.getAverageRating() != null)
                ? product.getAverageRating()
                : 0.0;

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(review -> {
                    ReviewDTO dto = convertToDTO(review);
                    dto.setProductId(productId);
                    dto.setAverageRating(currentAvgRating);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setUserName(review.getUserName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setUserId(review.getUserId());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}