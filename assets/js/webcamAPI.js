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
  long: '-76.86920849609373',
  lat: '39.01214204032336',
  radius: 100,
  lang: 'en',
  APIKEY: 'b1b6ceffb4msh87229b92a53ebb2p1f35b0jsnb579243600bf'
};

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
