package me.ayush272002.backend.dto;

import lombok.Data;
import me.ayush272002.backend.entity.Todo;

import java.time.LocalDate;

@Data
public class TodoDTO {
    private Long id;
    private String title;
    private String details;
    private LocalDate dueDate;
    private LocalDate createdAt;
    private boolean completed;

    public TodoDTO(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.details = todo.getDetails();
        this.dueDate = todo.getDueDate();
        this.createdAt = todo.getCreatedAt();
        this.completed = todo.isCompleted();
    }
}
