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

        // Create profile image
        const profileImg = document.createElement("img");
        profileImg.src = "Untitled.jpeg"; // Default profile picture
        profileImg.alt = "User Profile";
        profileImg.classList.add("profile-pic");

        // Create user name (Clickable)
        const name = document.createElement("h2");
        name.innerText = user.name;
        name.classList.add("clickable");
        name.style.cursor = "pointer";
        name.addEventListener("click", () => {
            localStorage.setItem("selectedUserId", user.id); // Store user ID
            localStorage.setItem("selectedUserName", user.name); // Store user name
            window.location.href = "posts.html"; // Redirect to posts page
        });

        // Create user email
        const email = document.createElement("p");
        email.innerHTML = `<strong>Email:</strong> ${user.email}`;

        // Create user address
        const address = document.createElement("p");
        address.innerHTML = `
            <strong>Street:</strong> ${user.address.street} <br>
            <strong>City:</strong> ${user.address.city} <br>
            <strong>Suite:</strong> ${user.address.suite} <br>
            <strong>Zip Code:</strong> ${user.address.zipcode} <br>
            <strong>Phone:</strong> ${user.phone}
        `;

        // Create post count
        const postCount = document.createElement("p");
        postCount.innerHTML = `<strong>Total Posts:</strong> ${totalPosts}`;

        // Append elements to card
        card.appendChild(profileImg);
        card.appendChild(name);
        card.appendChild(email);
        card.appendChild(address);
        card.appendChild(postCount);

        // Append card to container
        userContainer.appendChild(card);
    });
})
.catch(error => console.error("Error fetching data:", error));
