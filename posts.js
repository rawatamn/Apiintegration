const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=100"; 
const COMMENTS_API_URL = "https://jsonplaceholder.typicode.com/comments";
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
        // Count total comments for the post
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

        // Create a container for comments (hidden by default)
        const commentList = document.createElement("div");
        commentList.classList.add("comment-list", "hidden"); // Initially hidden

        // Create "View Comments" button with count
        const commentButton = document.createElement("button");
        commentButton.innerText = `View Comments (${totalComments})`; 
        commentButton.classList.add("comment-btn");
        commentButton.addEventListener("click", () => toggleComments(post.id, commentList, commentButton));

        // ✅ Create comment input field
        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Write a comment...";
        commentInput.classList.add("comment-input");

        // ✅ Create "Add Comment" button BELOW input field
        const addCommentButton = document.createElement("button");
        addCommentButton.innerText = "➕ Add Comment";
        addCommentButton.classList.add("add-comment-btn");
        //adding the functionality to catch input field
        addCommentButton.addEventListener("click",()=>{
            addComment(post.id,commentInput,commentList,commentButton)
        })

        // ✅ Comment Input Section (Input + Button in a separate div)
        const commentInputContainer = document.createElement("div");
        commentInputContainer.classList.add("comment-section");
        commentInputContainer.appendChild(commentInput);
        commentInputContainer.appendChild(addCommentButton); // ✅ Placed below input

        // Append elements to card
        card.appendChild(img);
        card.appendChild(postTitle);
        card.appendChild(commentButton);
        card.appendChild(commentList);
        card.appendChild(commentInputContainer); // ✅ Input + Button together
        postContainer.appendChild(card);
    });
})
.catch(error => {
    console.warn("Error fetching posts:", error);
    postContainer.innerHTML = `<p>Failed to load posts.</p>`;
});
function addComment(postId,inputField,commentList,commentButton){
    const commentText=inputField.value.trim()
    if(commentText===""){
        alert("please enter the text")
    return;}
    const newComment={
        postId:postId,
        name:"user",
        email:"user@gmail",
        body:commentText
        
    }
    fetch(COMMENTS_API_URL,{
        method:"POST",
        body:JSON.stringify(newComment),
        headers:{"Content-type":"application/json;charset=UTF-8"}
    })
    .then(response=>response.json())
    .then(comment=>{
        addCommentUI(comment,commentList)
        inputField.value="";
        const commentCountElement = commentButton;
        const currentCount = parseInt(commentCountElement.innerText.match(/\d+/)[0]);
        commentCountElement.innerText = `View Comments (${currentCount + 1})`;

    })
    .catch(error=>console.error("Error adding comment",error))
}
function addCommentUI(comment,commentList){
  const commentItem = document.createElement("div");
    commentItem.classList.add("comment-item");

    // ✅ Comment text (Initially Normal Text)
    const commentText = document.createElement("p");
    commentText.classList.add("comment-text");
    commentText.innerHTML = `<strong>${comment.name}:</strong> <span class="comment-body">${comment.body}</span>`;
commentList.appendChild(commentText)
    // ✅ Edit Button
   
}

// Function to fetch and toggle comments
function toggleComments(postId, commentList, button) {
    if (!commentList.classList.contains("hidden")) {
        commentList.classList.add("hidden"); 
        button.innerText = button.innerText.replace("Hide Comments", "View Comments");
        return;
    }

    fetch(`${COMMENTS_API_URL}?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            commentList.innerHTML = ""; 
            comments.forEach(comment => {
                const commentItem = document.createElement("p");
                commentItem.classList.add("comment");
                commentItem.innerHTML = `<strong>${comment.name}:</strong> ${comment.body}`;
                commentList.appendChild(commentItem);
            });

            commentList.classList.remove("hidden");
            button.innerText = `Hide Comments (${comments.length})`; 
        })
        .catch(error => console.error("Error fetching comments:", error));
}
