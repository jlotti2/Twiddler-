$(document).ready(() => {
  const $body = $('body');
  $body.html(''); // clear body when the page loads

  // Add the title at the top of the page
  const $title = $('<div class="title">Twiddler &#x1F426;</div>');
  $body.append($title);

   // Add styling for the title, username, and messages
   const style = `
   <style>
     .title {
       color: lightblue;
       text-align: center;
       margin-top: 20px;
       font-size: 6rem; /* Triple the default size */
     }
     .input-container {
       margin-bottom: 20px;
       text-align: center;
     }
     .btn-primary {
       margin-right: 10px;
     }
     .tweets-button-container {
       text-align: center;
     }
     .username {
       font-weight: bold;
       color: darkblue;
     }
     .message {
       padding: 10px;
       margin-bottom: 10px;
       border-radius: 5px;
     }
   </style>
 `;
 $body.append(style);

  // Create a container for the input fields and the Tweet button
  const $inputContainer = $('<form class="input-container"></form>');
  
  // Create input field for username
  const $usernameInput = $('<input type="text" id="usernameInput" placeholder="Enter your username" class="form-control mb-2 d-inline-block w-auto">');
  $inputContainer.append($usernameInput);

  // Create input field for tweet
  const $tweetInput = $('<input type="text" id="tweetInput" placeholder="Write a tweet..." class="form-control mb-2 d-inline-block w-auto">');
  $inputContainer.append($tweetInput);

  // Create button to submit the tweet
  const $tweetButton = $('<button type="submit" class="btn btn-primary">Tweet</button>');
  $inputContainer.append($tweetButton);

  // Append the input container to the body
  $body.append($inputContainer);

  // Create a container for the Show New Tweets button and center it
  const $tweetsButtonContainer = $('<div class="tweets-button-container mb-4"></div>');
  const $button = $('<button class="btn btn-primary">Show New Tweets</button>');
  $tweetsButtonContainer.append($button);
  $body.append($tweetsButtonContainer);

  // Create a div to hold the tweets
  const $tweetsDiv = $('<div></div>');
  $body.append($tweetsDiv);

  // Function to create new tweets
  function createNewTweets() {
    $tweetsDiv.empty(); // clear existing tweets

    streams.home.forEach((tweet) => {
      const $tweet = $('<div class="message"></div>');
      const $username = $(`<span class="username">@${tweet.user}:</span>`); // Add colon and space after username
      const text = tweet.message.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
      const createdAt = new Date(tweet.created_at); // Convert timestamp to Date object

      // Format the timestamp as desired
      const timestamp = createdAt.toLocaleString();

      // Calculate time ago using Moment.js
      const timeAgo = moment(tweet.created_at).fromNow();

      // Combine both timestamps in the tweet
      $tweet.html(`${text} <br> <small>Time Ago: ${timeAgo}</small> <br> <small>Created at: ${timestamp}</small>`);
      // Prepend the username to ensure it is included
      if ($tweet.find('.username').length === 0) {
        $tweet.prepend($username);
      }

      // Click event handler for the username to view user's messages
      $username.on('click', function(event) {
        // Save user data to local storage and redirect to user page
        const userMessages = streams.home.filter(msg => msg.user === tweet.user);
        localStorage.setItem('userMessages', JSON.stringify(userMessages));
        localStorage.setItem('username', tweet.user);
        window.location.href = 'user.html'; // Redirect to user.html page
      });

      // Click event handler for hashtags to view related tweets
      $tweet.on('click', '.hashtag', function(event) {
        const hashtag = $(this).text();
        const hashtagTweets = streams.home.filter(msg => msg.message.includes(hashtag));
        localStorage.setItem('hashtagTweets', JSON.stringify(hashtagTweets));
        localStorage.setItem('hashtag', hashtag);
        window.location.href = 'hashtag.html'; // Redirect to hashtag.html page
      });

      $tweetsDiv.append($tweet);
    });
  }

  // Attach click event to the button to show new tweets
  $button.click(createNewTweets);

  // Handle form submission for tweeting new messages
  $inputContainer.on('submit', (event) => {
    event.preventDefault();
    const username = $usernameInput.val();
    const message = $tweetInput.val();
    if (username.trim() !== "" && message.trim() !== "") {
      // Set the global visitor property
      window.visitor = username;
      
      // Call the writeTweet function with the message
      writeTweet(message);
      $tweetInput.val(''); // Clear tweet input field
      createNewTweets(); // Refresh tweet list
    } else {
      alert("Please enter both username and message before tweeting.");
    }
  });

 

// Assuming this function is defined elsewhere in your code
const writeTweet = (message) => {
  const visitor = window.visitor;

  if (!visitor){
    throw new Error('Set the global visitor property!');
  }

  const tweet = {
    user: visitor,
    message: message,
    created_at: new Date() // Add timestamp for the new tweet
  };
  addTweet(tweet);
};

// Assuming addTweet is defined and handles adding the tweet to streams.home
const addTweet = (newTweet) => {
  const username = newTweet.user;
  if (!streams.users[username]) {
    streams.users[username] = [];
  }
  streams.users[username].push(newTweet);
  streams.home.push(newTweet);
};

 // Optionally, call createNewTweets once to display tweets on page load
 createNewTweets();
});