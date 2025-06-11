package me.ayush272002.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.ayush272002.backend.dto.TodoDTO;
import me.ayush272002.backend.entity.Todo;
import me.ayush272002.backend.entity.User;
import me.ayush272002.backend.repository.TodoRepository;
import me.ayush272002.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/todos")
public class TodoController {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<?> getAllTodos(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Todo> todos = todoRepository.findByUser(user);

        List<TodoDTO> todoDTOs = todos.stream()
                .map(TodoDTO::new)
                .collect(Collectors.toList());
        System.out.println(todoDTOs);
        return ResponseEntity.ok(todoDTOs);
    }

    @PostMapping
    public ResponseEntity<?> createTodo(@Valid @RequestBody Todo todo, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        System.out.println("Control here");
        todo.setUser(user);
        todo.setCreatedAt(LocalDate.now());
        todo.setCompleted(false);
        System.out.println("Saving todo: " + todo);

        try {
            Todo savedTodo = todoRepository.save(todo);
            TodoDTO todoDTO = new TodoDTO(savedTodo);
            System.out.println("Saved todo: " + savedTodo);
            return new ResponseEntity<>(todoDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save todo");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<Todo> optionalTodo = todoRepository.findById(id);

        if(optionalTodo.isEmpty() || !optionalTodo.get().getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
        }

        Todo todo = optionalTodo.get();
        todo.setTitle(updatedTodo.getTitle());
        todo.setDetails(updatedTodo.getDetails());
        todo.setDueDate(updatedTodo.getDueDate());
        todo.setCompleted(updatedTodo.isCompleted());

        todoRepository.save(todo);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<Todo> optionalTodo = todoRepository.findById(id);

        if(optionalTodo.isEmpty() || !optionalTodo.get().getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
        }

        todoRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
