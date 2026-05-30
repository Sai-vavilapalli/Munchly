package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem,Integer>{
    List<MenuItem> findByCategory(String category);

    List<MenuItem> findByTypeAndPriceBetween(String type, double minPrice, double maxPrice);

    List<MenuItem> findByPriceBetween(double minPrice, double maxPrice);
}
