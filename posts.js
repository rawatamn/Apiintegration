const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=100"; 
const COMMENTS_API_URL = "https://jsonplaceholder.typicode.com/comments";
const postContainer = document.getElementById("postContainer");
const userTitle = document.getElementById("userTitle");

// Retrieve user details from localStorage
const selectedUserId = localStorage.getItem("selectedUserId");
const selectedUserName = localStorage.getItem("selectedUserName");

if (!selectedUserId) {
    alert("No user selected! Redirecting to user page.");
    window.location.href = "index.html";
} else {
    userTitle.innerText = `Posts by ${selectedUserName}`;
}

// Function to get a random image
function getRandomImage() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

// Fetch posts and comments
Promise.all([
    fetch(POSTS_API_URL).then(response => response.json()),
    fetch(COMMENTS_API_URL).then(response => response.json())
])
.then(([posts, comments]) => {
    const filteredPosts = posts.filter(post => post.userId == selectedUserId);

    if (filteredPosts.length === 0) {
        postContainer.innerHTML = `<p>No posts found for ${selectedUserName}.</p>`;
        return;
    }

    filteredPosts.forEach(post => {
        const totalComments = comments.filter(comment => comment.postId === post.id).length;

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

        // ✅ Create post body element
        const postBody = document.createElement("p");
        postBody.classList.add("post-body");
        postBody.innerText = post.body;
        //creating edit button
          // ✅ Create Edit Button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => openEditPopup(post, postTitle, postBody));

    // ✅ Create Delete Button
    const deletebutton=document.createElement("button");
    deletebutton.innerText="Delete";
    deletebutton.classList.add("delete-btn");
    deletebutton.addEventListener("click",()=>deletePost(post.id,card));


        // Create a container for comments (hidden by default)
        const commentList = document.createElement("div");
        commentList.classList.add("comment-list", "hidden");

        // Create "View Comments" button with count
        const commentButton = document.createElement("button");
        commentButton.innerText = `View Comments (${totalComments})`; 
        commentButton.classList.add("comment-btn");
        commentButton.addEventListener("click", () => toggleComments(post.id, commentList, commentButton));

        // Append elements to card
        card.appendChild(img);
        card.appendChild(postTitle);
        card.appendChild(postBody); // ✅ Added body to the card
        card.appendChild(commentButton);
        card.appendChild(editButton);
        card.appendChild(deletebutton);
        card.appendChild(commentList);
        postContainer.appendChild(card);
    });
})
.catch(error => {
    console.warn("Error fetching posts:", error);
    postContainer.innerHTML = `<p>Failed to load posts.</p>`;
});
let currentPost=null;
//edit function
function openEditPopup(post, postTitle, postBody) {
    // Store reference to the post being edited
    currentPost = { post, postTitle, postBody };

    // Set input values to current title and body
    document.getElementById("editTitle").value = post.title;
    document.getElementById("editBody").value = post.body;

    // Show the popup
    document.getElementById("editPopup").classList.remove("hidden");
}
//save function
document.getElementById("saveEdit").addEventListener("click",()=>{
    const editTitle=document.getElementById("editTitle").value
    const editBody=document.getElementById("editBody").value
    const updatedPost = { title: editTitle, body: editBody };

    fetch(`https://jsonplaceholder.typicode.com/posts/${currentPost.post.id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedPost),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then(response=>response.json())
    .then(data=>{
        currentPost.postTitle.innerText=data.title;
        currentPost.postBody.innerText=data.body;
        document.getElementById("editPopup").classList.add("hidden");
        currentPost=null;
    })
    .catch(error=>console.error("Error Updating Post",error))
})
document.getElementById("cancelEdit").addEventListener("click",()=>{
    document.getElementById("editPopup").classList.add("hidden");
})
//delete button
function deletePost(postId, card) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            card.remove(); // ✅ Remove post from UI
        } else {
            console.error("Failed to delete post");
        }
    })
    .catch(error => console.error("Error deleting post:", error));
}


// Function to fetch and toggle comments
function toggleComments(postId, commentList, button) {
    const card = commentList.closest(".card");

    if (commentList.style.display === "block") {
        commentList.style.display = "none";
        button.innerText = button.innerText.replace("Hide Comments", "View Comments");
        card.classList.remove("active"); // Reset z-index
        return;
    }

    fetch(`${COMMENTS_API_URL}?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            commentList.innerHTML = "";

            if (comments.length === 0) {
                commentList.innerHTML = `<p>No comments found.</p>`;
            } else {
                comments.forEach(comment => {
                    addCommentUI(comment, commentList);
                });
            }

            commentList.style.display = "block";
            button.innerText = `Hide Comments (${comments.length})`; 
            card.classList.add("active"); // Bring this card forward
        })
        .catch(error => console.error("Error fetching comments:", error));
}

// Function to add a comment to the UI
function addCommentUI(comment, commentList) {
    const commentItem = document.createElement("div");
    commentItem.classList.add("comment-item");

    // Create comment text
    const commentText = document.createElement("p");
    commentText.classList.add("comment-text");
    commentText.innerHTML = `<strong>${comment.name}:</strong> ${comment.body}`;

    // Append elements
    commentItem.appendChild(commentText);
    commentList.appendChild(commentItem);
}
document.getElementById("backBtn").addEventListener("click", () => {
    window.history.back(); // ✅ Go back to the previous page
});
document.getElementById("createPostBtn").addEventListener("click", () => {
    document.getElementById("createPostPopup").classList.remove("hidden"); // Show popup
});

document.getElementById("cancelPost").addEventListener("click", () => {
    document.getElementById("createPostPopup").classList.add("hidden"); // Hide popup
});
document.getElementById("savePost").addEventListener("click", () => {
    const title = document.getElementById("newPostTitle").value.trim();
    const body = document.getElementById("newPostBody").value.trim();

    if (!title || !body) {
        alert("Title and body cannot be empty!");
        return;
    }

    const newPost = {
        userId: selectedUserId,
        title: title,
        body: body
    };

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then(response => response.json())
    .then(data => {
        addPostToUI(data);
        document.getElementById("createPostPopup").classList.add("hidden"); // Hide popup
        document.getElementById("newPostTitle").value = ""; // Clear inputs
        document.getElementById("newPostBody").value = "";
    })
    .catch(error => console.error("Error creating post:", error));
});
function addPostToUI(post) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-post-id", post.id);

    // Create random image
    const img = document.createElement("img");
    img.src = getRandomImage();
    img.alt = "Random Photo";

    // Create Post Title
    const postTitle = document.createElement("h3");
    postTitle.innerText = post.title;

    // Create Post Body
    const postBody = document.createElement("p");
    postBody.classList.add("post-body");
    postBody.innerText = post.body;

    // Create Edit Button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => openEditPopup(post, postTitle, postBody));

    // Create Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => deletePost(post.id, card));

    // Append elements to card
    card.appendChild(img);
    card.appendChild(postTitle);
    card.appendChild(postBody);
    card.appendChild(editButton);
    card.appendChild(deleteButton);
    postContainer.prepend(card); // ✅ Adds the new post at the top
}
