# 🌐 JSONPlaceholder API - User Posts & Comments Management

## 📌 Project Overview
This project is built using the **JSONPlaceholder API**, which allows users to **view, create, edit, and delete posts**. It also enables users to see **comments on each post** and displays **random images** for posts.

---

## 🚀 Features
### 🔹 User Page
- Fetches and displays **users from the API**.
- Clicking on a user **redirects to their post page**.

### 🔹 Post Page (Individual User's Posts)
- Displays all **posts by the selected user**.
- Shows **post titles, bodies, and comments**.
- Uses **random images** for each post.

### 🔹 Comments Section
- Displays all **comments for each post**.
- Fetches comments using `GET /posts/{id}/comments`.
- Allows users to **view and hide comments** dynamically.

### 🔹 CRUD Operations on Posts
- **Create Post**: Users can create a new post with a **random image**.
- **Edit Post**: Users can update a post using the `PATCH /posts/{id}` API.
- **Delete Post**: Users can delete a post using `DELETE /posts/{id}`.

---

## ⚙️ Technologies Used
- **HTML, CSS, JavaScript**
- **JSONPlaceholder API**
- **Fetch API for HTTP Requests**
- **LocalStorage** (for selected user persistence)

---

## 🛠️ Setup Instructions
1. **Clone the repository**  
   ```bash
   git clone https://github.com/rawatamn/Apiintegration.git
