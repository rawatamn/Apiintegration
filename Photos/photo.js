const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=100"; 
const USERS_API_URL = "https://jsonplaceholder.typicode.com/users"; 
const postContainer = document.getElementById("postContainer");

// Function to get a random image
function getRandomImage() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

// Fetch posts and users simultaneously
Promise.all([
    fetch(POSTS_API_URL).then(res => res.json()),
    fetch(USERS_API_URL).then(res => res.json())
])
.then(([posts, users]) => {
    console.log("Posts API Response:", posts);  // Debugging
    console.log("Users API Response:", users);  // Debugging

    posts.forEach((post, index) => {
        // Find user based on post userId
        const user = users.find(user => user.id === post.userId);

        // Create a card for each post + user + image
        const card = document.createElement("div");
        card.classList.add("card");

        // Create a random image
        const img = document.createElement("img");
        img.src = getRandomImage();
        img.alt = "Random Photo";

        // Create post title element
        const postTitle = document.createElement("h3");
        postTitle.innerText = post.title;

        // Create name element (from user API)
        const name = document.createElement("h4");
        name.innerText = user ? user.name : "Unknown User";

        // Append elements to card
        card.appendChild(name);
        card.appendChild(img);
        card.appendChild(postTitle);
       
        postContainer.appendChild(card);
    });
})
.catch(error => {
    console.warn("Error fetching data, using fallback content instead:", error);

    for (let i = 0; i < 100; i++) {
        const card = document.createElement("div");
        card.classList.add("card");

        // Fallback random image
        const img = document.createElement("img");
        img.src = getRandomImage();
        img.alt = "Random Photo";

        // Fallback post title
        const postTitle = document.createElement("h3");
        postTitle.innerText = `Random Post ${i + 1}`;

        // Fallback name
        const name = document.createElement("h4");
        name.innerText = `Random User ${i + 1}`;

        // Append elements to card
        card.appendChild(name);
        card.appendChild(img);
        card.appendChild(postTitle);
        
        postContainer.appendChild(card);
    }
});
