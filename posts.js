const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=100"; 
const USERS_API_URL = "https://jsonplaceholder.typicode.com/users"; 
const postContainer = document.getElementById("postContainer");
const userTitle = document.getElementById("userTitle");

// Retrieve user details from localStorage
const selectedUserId = localStorage.getItem("selectedUserId");
const selectedUserName = localStorage.getItem("selectedUserName");

if (!selectedUserId) {
    alert("No user selected! Redirecting to user page.");
    window.location.href = "index.html"; // Redirect if no user selected
} else {
    userTitle.innerText = `Posts by ${selectedUserName}`;
}

// Function to get a random image
function getRandomImage() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

// Fetch posts
fetch(POSTS_API_URL)
    .then(response => response.json())
    .then(posts => {
        const filteredPosts = posts.filter(post => post.userId == selectedUserId);

        if (filteredPosts.length === 0) {
            postContainer.innerHTML = `<p>No posts found for ${selectedUserName}.</p>`;
            return;
        }

        filteredPosts.forEach(post => {
            // Create a card for each post
            const card = document.createElement("div");
            card.classList.add("card");

            // Create a random image
            const img = document.createElement("img");
            img.src = getRandomImage();
            img.alt = "Random Photo";

            // Create post title element
            const postTitle = document.createElement("h3");
            postTitle.innerText = post.title;

            // Append elements to card
            card.appendChild(img);
            card.appendChild(postTitle);
            postContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.warn("Error fetching posts:", error);
        postContainer.innerHTML = `<p>Failed to load posts.</p>`;
    });
