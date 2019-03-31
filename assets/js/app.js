const webcamConfig = {
    long: '',
    lat: '',
    radius: 0,
    lang: 'en',
    APIKEY: 'b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf'
};

function milesToKMConvert(miles) {
    return miles / 0.62137;
}

mapboxgl.accessToken =
    'pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA';

var map;

$(function() {
    $('#submitDestination').on('click', e => {
        e.preventDefault();
        $('#destLabel').empty();
        $('#webcams').empty();
        $('#webcamCard').show();
        $('#mapCard').show();
        webcamConfig.radius = Math.floor(
            milesToKMConvert($('#inputRadius').val())
        );

        if (webcamConfig.radius > 155) {
            webcamConfig.radius = 155;
            $('#inputRadius').val('155');
        }

        let searchQ = encodeURI($('#inputDestination').val());
        let URI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQ}.json?access_token=pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA`;

        // Getting info from mapbox
        $.ajax({
            type: 'GET',
            url: URI,
            contentType: 'application/json'
        }).then(res => {
            //this is a bandaid for testing purposes, need to find a better solution
            webcamConfig.lat = res.features[0].center[1]; //long
            webcamConfig.long = res.features[0].center[0]; //lat

            // creates a new map object and index.html will take the map obj and display it
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: res.features[0].center, //[long, lat]
                zoom: 10
            });
            var destination = decodeURI($('#inputDestination').val());
            $('#destLabel').append("Map of: " + destination);
            $('#inputRadius').val('');
            $('#inputDestination').val('');

            var favorites = [];
            $("#add-fav").on("click", function(event) {
                event.preventDefault();
              
                // Grabs current destination and pushes it into an array:
                var inputFav = destination;
                favorites.push(inputFav);
                console.log(favorites);

                // appends the favorites card with a new button:
                $("ul").append("<li>#destination</li>");
            });


            










            // With the data from mapbox, it's passing it to webcam
            $.ajax({
                type: 'GET',
                url: `https://webcamstravel.p.rapidapi.com/webcams/list/nearby=${
                    webcamConfig.lat
                },${webcamConfig.long},${webcamConfig.radius}?lang=${
                    webcamConfig.lang
                }&show=webcams%3Atimelapse`,
                contentType: 'application/json',
                xhrFields: {
                    withCredentials: false
                },
                headers: {
                    'X-RapidAPI-Key': webcamConfig.APIKEY
                }
            }).then(res => {
                //as of right now, this puts out ALL the timelapses.
                res.result.webcams.forEach(i => {
                    //checking if the current iterated webcam is active
                    if (i.status === 'active') {
                        if (i.timelapse.day.available) {
                            //checking if the 'day' timelapse is available
                            $('#webcams').append(
                                `<div class="card my-2 rounded">
                                <iframe src='${
                                    i.timelapse.day.embed
                                }' allow="fullscreen" class="car-img-top rounded"></iframe>
                                <div class="card-body">
                                <p class="card-text">
                                Location:<br/>
                                 ${i.title}<br/>
                                status: <span class='text-success'>${
                                    i.status
                                }</span>
                                </p>
                                </div>
                                </div>
                                `
                            );
                        } else if (i.timelapse.month.available) {
                            // if not, checking if the 'month' timelapse is available
                            $('#webcams').append(
                                `<div class="card my-2 rounded">
                              <iframe src='${
                                  i.timelapse.month.embed
                              }' allow="fullscreen" class="car-img-top rounded"></iframe>
                              <div class="card-body">
                              <p class="card-text">
                              Location:<br/>
                               ${i.title}<br/>
                              status: <span class='text-success'>${
                                  i.status
                              }</span>
                              </p>
                              </div>
                              </div>
                              `
                            );
                        } else if (i.timelapse.year.available) {
                            //if not, checking if the 'year' timelapse is available
                            $('#webcams').append(
                                `<div class="card my-2 rounded">
                              <iframe src='${
                                  i.timelapse.year.embed
                              }' allow="fullscreen" class="car-img-top rounded"></iframe>
                              <div class="card-body">
                              <p class="card-text">
                              Location:<br/>
                               ${i.title}<br/>
                              status: <span class='text-success'>${
                                  i.status
                              }</span>
                              </p>
                              </div>
                              </div>
                              `
                            );
                        } else if (i.timelapse.lifetime.available) {
                            //if not, checking if the 'lifetime' timelapse is available
                            $('#webcams').append(
                                `<div class="card my-2 rounded">
                              <iframe src='${
                                  i.timelapse.lifetime.embed
                              }' allow="fullscreen" class="car-img-top rounded"></iframe>
                              <div class="card-body">
                              <p class="card-text">
                              Location:<br/>
                               ${i.title}<br/>
                              status: <span class='text-success'>${
                                  i.status
                              }</span>
                              </p>
                              </div>
                              </div>
                              `
                            );
                        }
                    } else {
                        $('#webcams').append(
                            `
                            <div class="alert alert-danger" role="alert">
                           Sorry! none of the webcams seems to be active. Check back later!
                          </div>
                            `
                        );
                    }
                });
            });
        });
    });
});


/* global moment firebase */

// Initialize Firebase
//var config = {
//   apiKey: "AIzaSyBPH0U6IgZYOtTKpIFFzIZUM1gPeqF6OGA",
//    authDomain: "world-lens-facdf.firebaseapp.com",
//    databaseURL: "https://world-lens-facdf.firebaseio.com",
//    projectId: "world-lens-facdf",
//    storageBucket: "world-lens-facdf.appspot.com",
//    messagingSenderId: "290458329334"
//    };

//firebase.initializeApp(config); 
  
// Create a variable to reference the database
//var database = firebase.database();

// Button for adding Favorites

//});