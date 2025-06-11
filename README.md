# To-Do List Application

This project is a full-stack to-do list application built with Spring Boot for the backend and Next.js for the frontend.

### Project Structure

```
├── backend/         # Spring Boot backend
└── frontend/        # Next.js frontend
```

## Backend (Spring Boot)
The backend is a RESTful API built with Spring Boot that provides endpoints for user authentication and to-do item management.

Key Components
- **Authentication** : Handles user registration, login, and logout
- **To-Do Management**: Manages CRUD operations for to-do items

API Endpoints

**Authentication**
- `POST /api/v1/auth/signup` : Create a new user account
- `POST /api/v1/auth/signin` : Authenticate a user and receive a JWT token
- `POST /api/v1/auth/logout` : Log out a user

**To-Do Operations**
- `GET /api/v1/todos`: Get all to-dos for the authenticated user
- `POST /api/v1/todos`: Create a new to-do item
- `PUT /api/v1/todos/{id}` : Update an existing to-do item
- `DELETE /api/v1/todos/{id}` : Delete a to-do item

### Technologies Used
- Spring Boot 3.5.0
- Spring Security with JWT Authentication
- Spring Data JPA
- PostgreSQL
- Lombok
- Java 21

## Frontend (Next.js)
The frontend is a responsive web application built with Next.js that provides a user-friendly interface for managing to-do items.

**Key Pages**
- `/` : Landing page
- `/signin` : User login page
- `/signup` : User registration page
- `/dashboard` : Main dashboard for managing to-do items

**Technologies Used**
- Next.js
- React
- TypeScript
- Shadcn UI components
- Lucide React icons

## Running the Application

### Clone the repository:
```shell
git clone https://github.com/Ayush272002/Todo-List
cd Todo-List
```


### Backend
1. Navigate to the backend directory:
```shell
cd backend
```

2. Configure your database in the `.env` file (see `.env.example` for required variables)

3. Run the Spring Boot application:
```shell
./mvnw spring-boot:run
```

### Frontend
1. Navigate to the frontend directory:
```shell
cd frontend
```

2. Configure your environment variables in the `.env` file (see `.env.example` for required variables)

3. Install dependencies:
```shell
pnpm install
```

4. Run the development server:
```shell
pnpm dev
```

5. Open http://localhost:3000 in your browser

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.