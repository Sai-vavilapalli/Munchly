package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByUserId(int userId);

    //int countByCartId(int id);
}
