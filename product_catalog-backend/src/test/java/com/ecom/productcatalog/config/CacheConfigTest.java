package com.ecom.productcatalog.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CacheConfigTest {

    private final CacheConfig cacheConfig = new CacheConfig();

    @Mock
    private RedisConnectionFactory connectionFactory;

    @Mock
    private Cache cache;

    @Test
    @DisplayName("Should create RedisCacheManager with configured caches")
    void shouldCreateRedisCacheManager() {
        RedisCacheManager manager = cacheConfig.cacheManager(connectionFactory);
        assertNotNull(manager);
    }

    @Test
    @DisplayName("CacheErrorHandler should swallow Redis exceptions gracefully without throwing")
    void cacheErrorHandlerShouldSwallowExceptions() {
        CacheErrorHandler errorHandler = cacheConfig.errorHandler();
        assertNotNull(errorHandler);

        when(cache.getName()).thenReturn("categories");
        RuntimeException testEx = new RuntimeException("Redis connection refused");

        // Verify none of these throw exceptions (fault tolerant)
        assertDoesNotThrow(() -> errorHandler.handleCacheGetError(testEx, cache, "all"));
        assertDoesNotThrow(() -> errorHandler.handleCachePutError(testEx, cache, "all", "testValue"));
        assertDoesNotThrow(() -> errorHandler.handleCacheEvictError(testEx, cache, "all"));
        assertDoesNotThrow(() -> errorHandler.handleCacheClearError(testEx, cache));
    }
}
