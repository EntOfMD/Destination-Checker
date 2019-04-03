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

// the config for webcam api
const webcamConfig = {
    long: '',
    lat: '',
    radius: 30,
    lang: 'en',
    APIKEY: 'b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf'
};
//general global object to fill in later once info from api are called
const storeSearch = {
    place: undefined,
    radius: milesToKMConvert($('#inputRadius').val()),
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

const fx = {
    getMap: function(other) {
        $('#webcams').empty();
        $('#weatherInfo').empty();
        var searchQ;
        if ($('#inputDestination').val().length == 0) {
            searchQ = encodeURI(other);
        } else {
            searchQ = encodeURI($('#inputDestination').val());
        }

        var URI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQ}.json?access_token=pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA`;
        // Getting info from mapbox
        $.ajax({
            type: 'GET',
            url: URI,
            contentType: 'application/json'
        }).then(res => {
            //this is a bandaid for testing purposes, need to find a better solution
            webcamConfig.lat = res.features[0].center[1]; //long
            webcamConfig.long = res.features[0].center[0]; //lat
            storeSearch.Lat = webcamConfig.lat;
            storeSearch.Lon = webcamConfig.long;
            storeSearch.center = res.features[0].center;
            //2nd last edit
            storeSearch.place = res.features[0].text;

            // creates a new map object and index.html will take the map obj and display it
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: storeSearch.center, //[long, lat]
                zoom: 10
            });

            fx.getWebCams(res);
            showWeather(res);
            $('#inputDestination').val('');
            $('#inputRadius').val('');
            // // THIS IS IMPORTANT!! THIS IS WHAT PUSHES THE SEARCH INTO DATABASE
            pushToDB(storeSearch);
        });
    },
    getWebCams: function(mapInfo) {
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
                          status: <span class='text-success'>${i.status}</span>
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
                        status: <span class='text-success'>${i.status}</span>
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
                        status: <span class='text-success'>${i.status}</span>
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
                        status: <span class='text-success'>${i.status}</span>
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
    }
};
$(function() {
    $('#submitDestination').on('click', e => {
        e.preventDefault();
        $('#webcams').empty();
        $('#weatherInfo').empty();
        // storeSearch.place = $('#inputDestination').val();

        //if user enters anything over webcam's limit, it'll set to limit.
        if (webcamConfig.radius > 155) {
            webcamConfig.radius = milesToKMConvert(155);
            $('#inputRadius').val('155');
            storeSearch.radius = $('#inputRadius').val();
        } else {
            webcamConfig.radius = milesToKMConvert($('#inputRadius').val());
            storeSearch.radius = webcamConfig.radius;
        }
        // getMap chains fx.getWebCams() with the info given
        fx.getMap();

        //remove this to stop blanking
        // $('#recentBtnGrp').empty();
    });
});
