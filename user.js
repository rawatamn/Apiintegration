const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";
const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";
const userContainer = document.getElementById("userContainer");

// Fetch users and posts simultaneously
Promise.all([
    fetch(USERS_API_URL).then(response => response.json()),
    fetch(POSTS_API_URL).then(response => response.json())
])
.then(([users, posts]) => {
    users.forEach(user => {
        // Count total posts of the user
        const userPosts = posts.filter(post => post.userId === user.id);
        const totalPosts = userPosts.length;

        // Create card element
        const card = document.createElement("div");
        card.classList.add("card");

        // Create profile image (Using UI Avatars for unique images)
        const profileImg = document.createElement("img");
        profileImg.src = `https://ui-avatars.com/api/?name=${user.name.replace(" ", "+")}&background=random&size=100`;
        profileImg.alt = "User Profile";
        profileImg.classList.add("profile-pic");

        // Create user name (Clickable)
        const name = document.createElement("h2");
        name.innerText = user.name;
        name.classList.add("clickable");

        // Create email with mail icon
        const email = document.createElement("p");
        email.innerHTML = `📧 <strong>Email:</strong> ${user.email}`;

        // Create address section
        const address = document.createElement("p");
        address.innerHTML = `
            📍 <strong>Address:</strong> ${user.address.street}, ${user.address.city}
        `;

        // Create post count
        const postCount = document.createElement("p");
        postCount.innerHTML = `📝 <strong>Total Posts:</strong> ${totalPosts}`;

        // Create "View Posts" button
        const viewPostsBtn = document.createElement("button");
        viewPostsBtn.innerText = "📜 View Posts";
        viewPostsBtn.classList.add("view-posts-btn");
        viewPostsBtn.addEventListener("click", () => {
            localStorage.setItem("selectedUserId", user.id);
            localStorage.setItem("selectedUserName", user.name);
            window.location.href = "posts.html"; // Redirect to posts page
        });

        // Append elements to card
        card.appendChild(profileImg);
        card.appendChild(name);
        card.appendChild(email);
        card.appendChild(address);
        card.appendChild(postCount);
        card.appendChild(viewPostsBtn); // ✅ Added View Posts Button

        // Append card to container
        userContainer.appendChild(card);
    });
})
.catch(error => console.error("Error fetching data:", error));
