package me.ayush272002.backend.repository;

import me.ayush272002.backend.entity.Todo;
import me.ayush272002.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUser (User user);
}
