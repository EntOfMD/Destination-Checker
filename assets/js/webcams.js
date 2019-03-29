
// Google Places API Key: AIzaSyDI_B6TXNNMg3hlGP2bVE0lXqo53-7dWEk
// Google Maps API Key: AIzaSyDRewoH-RWa1-wj2sYtmVlNqOxCABIsjU4
// Rapid API Key: b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf


// Step 1: pass onclick entry through Google Maps API to secure geographic coordinates;


// Step 2: pass geographic coordinates through webcam API;



// Step 3: render nearest webcam to the html;








// Initial array of topics:
var topics = ["Maui", "London", "Paris", "Moscow", "Cape Town",
"San Paulo", "Tokyo", "Beijing", "Abu Dhabi",
"Caracas"];

// displaytopicInfo function re-renders the HTML to display the appropriate content
function displaytopicInfo() {
  var topic = $(this).text();

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    topic + "&rating=g&api_key=dc6zaTOxFJmzC&limit=10";

        // Creating an AJAX call for the specific topic button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        })
          .then(function(response) {
            console.log(response.data);

            // Store an array of results in the results variable.
            var results = response.data;

            // for each element in the variable, starting at index 0:
            for (var i = 0; i < results.length; i++) {
              // create an div for each gif:
              var topicDiv = $("<div>");
              // pull each element's rating and assign it to the var rating:
              var rating = results[i].rating;
              // create a paragraph that includes the rating:
              var p = $("<p>").text("Rating: " + rating);
              // Create an image html element and assign it to a variable:
              var topicImage = $("<img>");
              // Create a class of 'gif' to work with the onlick, below:
              topicImage.addClass("gif");
              // Setting the src attribute of the image to a property pulled off the result item
              // This is to make the onclick function, below, toggle the gif from still to animate:
              topicImage.attr("src", results[i].images.fixed_height_still.url);
              topicImage.attr("data-still", results[i].images.fixed_height_still.url);
              topicImage.attr("data-animate", results[i].images.fixed_height.url);
              topicImage.attr("data-state", "still");             
              topicDiv.prepend(p);
              // prepend the image to the topicDiv div (this puts the associated text below the associated image):
              topicDiv.prepend(topicImage);
              // prepend the entire topicDiv so that the most recent is ontop
              $("#gifs-appear-here").prepend(topicDiv);
            }
            // Onclick function to toggle the state from still to animate:
            $(".gif").on("click", function() {
              // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
              var state = $(this).attr("data-state");
              console.log(state);
              // If the clicked image's state is still, update its src attribute to what its data-animate value is.
              // Then, set the image's data-state to animate
              // Else set src to the data-still value
              if (state === "still") {
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
              } else {
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
              }
            });
          });
      }

      // Function for displaying topic data:
      function renderButtons() {

        // Deleting the topics prior to adding new topics
        // (this is necessary otherwise you will have repeat buttons):
        $("#buttons-view").empty();

        // Looping through the array of topics:
        for (var i = 0; i < topics.length; i++) {

          // Then dynamicaly generating buttons for each topic in the array.
          // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          var a = $("<button>");
          // Adding a class of topic-btn to our button
          a.addClass("topic-btn");
          // Adding a data-attribute
          a.attr("data-name", topics[i]);
          // Providing the initial button text
          a.text(topics[i]);
          // Adding the button to the buttons-view div
          $("#buttons-view").append(a);
        }
      }

      // This function handles events where a topic button is clicked
      $("#add-topic").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var topic = $("#topic-input").val().trim();

        // Adding topic from the textbox to our array
        topics.push(topic);

        // Calling renderButtons which handles the processing of our topic array
        renderButtons();
      });

      // Adding a click event listener to all elements with a class of "topic-btn"
      $(document).on("click", ".topic-btn", displaytopicInfo);

      // Calling the renderButtons function to display the intial buttons
      renderButtons();

