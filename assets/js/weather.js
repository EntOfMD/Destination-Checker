const weatherConfig = {
  APIKEY: '166a433c57516f51dfab1f7edaed8413',
  queryURL: function(location) {
    return (
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      location +
      '&units=imperial&appid=' +
      this.APIKEY
    );
  }
};

// Here we run our AJAX call to the OpenWeatherMap API
function showWeather(info) {
  weatherForecast(info);
  $.ajax({
    url: weatherConfig.queryURL(info.features[0].place_name),
    method: 'GET'
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(res) {
      // Log the resulting object
      console.log(res);
      $('#weatherHeader').html(`Weather for ${info.features[0].place_name}`);
      $('#weatherInfo').append(`
<div class='card p-3 border-primary' style="width:18rem;">
<h5 class="card-header>Current Temp</h5>

<h5 class="card-title">Currently: ${Math.floor(res.main.temp)}º F.</h5>
<h6 class="card-subtitle mb-2"><i class="fas fa-temperature-high text-danger"></i> It will be high of ${Math.floor(
        res.main.temp_max
      )}º F. 
      <br/>
      <i class="fas fa-temperature-low text-warning"></i> low of ${Math.floor(
        res.main.temp_min
      )}º F.</h6>
    <p class="card-text"><i class="fas fa-cloud text-secondary"></i> It will be mainly ${
      res.weather[0].description
    }. <br/>
    <i class="fas fa-wind text-info"></i> There will be wind upto ${
      res.wind.speed
    } mph</p>
    <h6 class='text-secondary'>Report time: ${moment
      .unix(res.dt)
      .format('llll')}</h6>
    
    </div>
    

      `);
    });
}
function weatherForecast(info) {
  let lat = info.features[0].center[1];
  let lon = info.features[0].center[0];
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${
      weatherConfig.APIKEY
    }
        `
  }).then(res => {
    res.list.forEach(i => {
      //   console.log(moment.unix(i.dt).format('llll'));
    });
  });
}

//   // Transfer content to HTML
//   $('.city').html('<h1>' + response.name + ' Weather Details</h1>');
//   $('.wind').text('Wind Speed: ' + response.wind.speed);
//   $('.humidity').text('Humidity: ' + response.main.humidity);
//   $('.temp').text('Temperature (F) ' + response.main.temp);

//   // Log the data in the console as well
//   console.log('Wind Speed: ' + response.wind.speed);
//   console.log('Humidity: ' + response.main.humidity);
//   console.log('Temperature (F): ' + response.main.temp);
