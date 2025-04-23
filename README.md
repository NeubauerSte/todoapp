# ToDo App ✅

A full-stack task management app with authentication, built using:

- **Frontend:** React (with AuthContext and reusable components)
- **Backend:** Spring Boot + REST API + PostgreSQL
- **Build Year:** 2025

---

## 📁 Project Structure

```
📦 todo-app
├── frontend
│   └── src
│       ├── main.jsx
│       ├── App.jsx
│       ├── context/AuthContext.jsx
│       ├── utils/logEvent.js
│       └── components/
│           ├── ToDoList.jsx
│           ├── ToDoItem.jsx
│           ├── Login.jsx
│           ├── Logout.jsx
│           └── GeneralButton.jsx
├── backend
│   └── src
│       ├── main/java/com/example/todo/
│       │   ├── ToDoApplication.java
│       │   ├── repository/
│       │   ├── controller/
│       │   └── entity/
│       ├── main/resources/application.properties
│       └── test/java/com/example/todo/ToDoApplicationTests.java
```

---

## 🚀 Features

- ✅ Create / Update / Delete tasks
- 🔐 JWT-based Authentication
- 👥 Role-based Access (User/Admin)
- 📝 Form validation and notifications
- 🌐 RESTful API integration (Spring Boot)

---

## 🛠️ Installation & Running

### 1. Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Make sure PostgreSQL is running and the credentials are configured in `application.properties`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Tech Stack

| Layer     | Tech                             |
|-----------|----------------------------------|
| Frontend  | React, Vite, Tailwind            |
| Backend   | Spring Boot, Java, JPA           |
| Database  | PostgreSQL                       |
| Auth      | JWT, Spring Security             |

---


## 📄 License

MIT – Free for personal and commercial use.
