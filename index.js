$(document).ready(() => {
  const $body = $('body');
  $body.html(''); // clear body when the page loads

  

  // Create a button for showing new tweets
  const $button = $('<button>Show New Tweets</button>');
  $body.append($button);

  // Create a div to hold the tweets
  const $tweetsDiv = $('<div></div>');
  $body.append($tweetsDiv);

  // Create input field and button for writing a new tweet
  const $tweetInput = $('<input type="text" id="tweetInput" placeholder="Write a tweet...">');
  const $tweetButton = $('<button>Tweet</button>');
  $body.append($tweetInput);
  $body.append($tweetButton);

  // Function to create new tweets
  function createNewTweets() {
    $tweetsDiv.empty(); // clear existing tweets

    streams.home.forEach((tweet) => {
      const $tweet = $('<div></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const text = tweet.message.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
      const createdAt = new Date(tweet.created_at); // Convert timestamp to Date object

      // Format the timestamp as desired
      const timestamp = createdAt.toLocaleString();

      // Calculate time ago using Moment.js
      const timeAgo = moment(tweet.created_at).fromNow();

      // Combine both timestamps in the tweet
      $tweet.html(`${text} <br> <small>Time Ago: ${timeAgo}</small> <br> <small>Created at: ${timestamp}</small>`);
      $tweet.prepend($username); // Prepend the username to ensure it is included

      // Click event handler for the username to view user's messages
      $username.on('click', function(event) {
        // Alert with a list of messages posted by the user
        const userMessages = streams.home.filter(msg => msg.user === tweet.user);
        let alertMessage = `Messages by @${tweet.user}: \n`;
        userMessages.forEach(msg => {
          const msgCreatedAt = new Date(msg.created_at);
          const msgTimestamp = msgCreatedAt.toLocaleString();
          const msgTimeAgo = moment(msg.created_at).fromNow();
          alertMessage += `- "${msg.message}" (Created at: ${msgTimestamp}, ${msgTimeAgo} ago)\n`;
        });
        alert(alertMessage);
      });

      // Click event handler for hashtags to view related tweets
      $tweet.on('click', '.hashtag', function(event) {
        const hashtag = $(this).text();
        const hashtagTweets = streams.home.filter(msg => msg.message.includes(hashtag));
        let alertMessage = `Tweets with ${hashtag}: \n`;
        hashtagTweets.forEach(msg => {
          const msgCreatedAt = new Date(msg.created_at);
          const msgTimestamp = msgCreatedAt.toLocaleString();
          const msgTimeAgo = moment(msg.created_at).fromNow();
          alertMessage += `@${msg.user}: "${msg.message}" (Created at: ${msgTimestamp}, ${msgTimeAgo} ago)\n`;
        });
        alert(alertMessage);
      });

      $tweetsDiv.append($tweet);
    });
  }

  // Attach click event to the button to show new tweets
  $button.click(createNewTweets);

  // Handle tweeting new messages
  $tweetButton.click(() => {
    const message = $tweetInput.val();
    if (message.trim() !== "") {
      writeTweet(message);
      $tweetInput.val(''); // Clear input field
      createNewTweets(); // Refresh tweet list
    } else {
      alert("Please write a message before tweeting.");
    }
  });

  const writeTweet = (message) => {
    const visitor = window.visitor;
  
    if (!visitor){
      throw new Error('Set the global visitor property!');
    }
  
    const tweet = {
      user: visitor,
      message: message,
    };
    addTweet(tweet);
  };

  // Optionally, call createNewTweets once to display tweets on page load
  createNewTweets();
});