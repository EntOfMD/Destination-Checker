/* global moment firebase */

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBPH0U6IgZYOtTKpIFFzIZUM1gPeqF6OGA',
  authDomain: 'world-lens-facdf.firebaseapp.com',
  databaseURL: 'https://world-lens-facdf.firebaseio.com',
  projectId: 'world-lens-facdf',
  storageBucket: 'world-lens-facdf.appspot.com',
  messagingSenderId: '290458329334'
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Button for adding Favorites
$('#add-fav').on('click', function(event) {
  event.preventDefault();

  // Grabs user input
  var inputFav = $('#searchQ');

  // Creates local "temporary" object for holding favorites data
  var newFav = {
      destination: inputFav
  };

  // Uploads destination to the database
  database.ref().push(newFav);

  // Logs everything to console
  console.log(newFav.destination);

  // Create Firebase event for adding favorites to the database and a row in the html when a user adds an entry
  database.ref().on('child_added', function(childSnapshot) {
      console.log(childSnapshot.val());

      // Store everything into a variable.
      var inputFav = childSnapshot.val().destination;
      console.log(inputFav);

      // Create the new row for the favorites list
      var newRow = $('<tr>').append($('<td>').text(inputFav));

      // Append the new row to the table
      $('#favorites-table > tbody').append(newRow);
  });
});
