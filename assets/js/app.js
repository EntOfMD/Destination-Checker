/* 
NODEJS request format
________________________
unirest
.get(
    'https://webcamstravel.p.rapidapi.com/webcams/list/nearby=39.01214204032336,-76.86920849609373,250?lang=en&show=webcams%3Atimelapse'
    )
    .header(
        'X-RapidAPI-Key',
        'b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf'
        )
        .end(function(result) {
            console.log(result.status, result.headers, result.body);
        });
        
        */

const APIconfig = {
  long: '',
  lat: '',
  radius: 100,
  lang: 'en',
  APIKEY: 'b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf'
};

mapboxgl.accessToken =
  'pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA';
var map;

$('#submitDestination').on('click', e => {
  e.preventDefault();
  $('#webcams').empty();
  let searchQ = encodeURI($('#inputDestination').val());
  let URI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQ}.json?access_token=pk.eyJ1IjoibW1yeWR6IiwiYSI6ImNqdHU3N3J5ZzBiMmUzeW1ieW1ycXI2OW0ifQ.swCDKQIl5yECHO6-QVgcTA`;

  $.ajax({
    type: 'GET',
    url: URI,
    contentType: 'application/json'
  }).then(res => {
    APIconfig.lat = res.features[0].center[1];
    APIconfig.long = res.features[0].center[0];

    console.log(res.features);

    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: res.features[0].center,
      zoom: 10
    });

    $.ajax({
      type: 'GET',
      url: `https://webcamstravel.p.rapidapi.com/webcams/list/nearby=${
        APIconfig.lat
      },${APIconfig.long},${APIconfig.radius}?lang=${
        APIconfig.lang
      }&show=webcams%3Atimelapse`,
      contentType: 'application/json',
      xhrFields: {
        withCredentials: false
      },
      headers: {
        'X-RapidAPI-Key': APIconfig.APIKEY
      }
    }).then(res => {
      //   console.log(res.result.webcams);
      res.result.webcams.forEach(i => {
        console.log(i);
        $('#webcams').append(`<iframe src=${i.timelapse.day.embed}></iframe>`);
      });
    });
  });
});
