package com.farmchainX.farmchainX.repository;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.farmchainX.farmchainX.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRetailerIdOrderByCreatedAtDesc(Long retailerId);

    List<Order> findByRetailerIdOrderByCreatedAtDesc(Long retailerId, Pageable pageable);

    long countByRetailerIdAndStatusNot(Long retailerId, String status);

    @Query("SELECT COUNT(o) > 0 FROM Order o WHERE o.productId = :productId AND o.status != :status")
    boolean existsByProductIdAndStatusNotEqual(@Param("productId") Long productId, @Param("status") String status);
}
