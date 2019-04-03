// the config for webcam api
const webcamConfig = {
    long: '',
    lat: '',
    radius: 10,
    lang: 'en',
    APIKEY: 'b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf'
};
//general global object to fill in later once info from api are called
const storeSearch = {
    place: undefined,
    radius: undefined,
    Lat: undefined,
    Lon: undefined,
    center: undefined
};

//function to convert miles to kilometers(input to webcam api)
function milesToKMConvert(miles) {
    return Math.floor(miles / 0.62137);
}

//for mapbox
var map;
mapboxgl.accessToken =
    'pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA';

$(function() {
    $('#submitDestination').on('click', e => {
        e.preventDefault();
        $('#destLabel').empty();
        $('#webcams').empty();
        $('#weatherInfo').empty();
        storeSearch.place = $('#inputDestination').val();
        storeSearch.radius = $('#inputRadius').val();

        //if user enters anything over webcam's limit, it'll set to limit.
        if (webcamConfig.radius > 155) {
            webcamConfig.radius = milesToKMConvert(155);
            $('#inputRadius').val('155');
        } else {
            webcamConfig.radius = milesToKMConvert($('#inputRadius').val());
            $('#webcamCard').show();
            $('#mapCard').show();
        }

        let searchQ = encodeURI($('#inputDestination').val());

        let URI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQ}.json?access_token=pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA`;

        // Getting info from mapbox
        $.ajax({
            type: 'GET',
            url: URI,
            contentType: 'application/json'
        }).then(res => {
            showWeather(res);

            //this is a bandaid for testing purposes, need to find a better solution
            webcamConfig.lat = res.features[0].center[1]; //long
            storeSearch.Lat = webcamConfig.lat;
            webcamConfig.long = res.features[0].center[0]; //lat
            storeSearch.Lon = webcamConfig.long;
            storeSearch.center = res.features[0].center;
            pushToDB(storeSearch);

            // creates a new map object and index.html will take the map obj and display it
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: res.features[0].center, //[long, lat]
                zoom: 10
            });

            // With the data from mapbox, it's passing it to webcam
            $.ajax({
                type: 'GET',
                url: `https://webcamstravel.p.rapidapi.com/webcams/list/limit=${$(
                    '#inputWebcamLimit'
                ).val()}/nearby=${webcamConfig.lat},${webcamConfig.long},${
                    webcamConfig.radius
                }?lang=${webcamConfig.lang}&show=webcams%3Atimelapse`,
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
                                `

                                <div class="p-2 bd-highlight flex-fill">
                                <div class="card my-2 rounded">
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
var config = {
    apiKey: 'AIzaSyBPH0U6IgZYOtTKpIFFzIZUM1gPeqF6OGA',
    authDomain: 'world-lens-facdf.firebaseapp.com',
    databaseURL: 'https://world-lens-facdf.firebaseio.com',
    projectId: 'world-lens-facdf',
    storageBucket: 'world-lens-facdf.appspot.com',
    messagingSenderId: '290458329334'
};

firebase.initializeApp(config);

// // Create a variable to reference the database
var database = firebase.database();

// Button for adding Favorites
$('#add-fav').on('click', function(event) {
    event.preventDefault();

    // Uploads destination to the database
    database.ref().push(firebaseFav);

    // Logs everything to console
    console.log(firebaseFav);

    // Create Firebase event for adding favorites to the database and a row in the html when a user adds an entry
    database.ref().on('child_added', function(childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var inputFav = childSnapshot.val().destination;
        console.log(inputFav);

        // Create the new row for the favorites list
        var newRow = $('<tr>').append($('<td>').text(firebaseFav));

        // Append the new row to the table
        $('#fav-table > tbody').append(newRow);
    });

    firebaseFav = null;
    firebaseFav = [];
});
