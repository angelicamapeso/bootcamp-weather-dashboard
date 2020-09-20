//Search button event listener
document.getElementById('search-city').addEventListener('submit', submitSearch);

function submitSearch(event) {
  event.preventDefault();
  resetSearchError();
  
  const userInput = getUserInput();

  if (userInput) {
    startGettingWeatherData(userInput);
  } else {
    document.getElementById('city-name').value = '';
    showSearchError('Please enter a city name');
  }
}

function getUserInput() {
  let userInput = document.getElementById('city-name').value;
  userInput = userInput.replace(/\s/g,'');
  return userInput;
}

function resetSearchError() {
  document.getElementById('city-name').classList.remove('border-danger');
  document.getElementById('error').textContent = '';
}

function showSearchError(message) {
  document.getElementById('city-name').classList.add('border-danger');
  document.getElementById('error').textContent = message;
}
//fetch the data
  //error if city could not be found
  
  //if city can be found and data retrieved
  //display city in search history 
    //Ensure that first letter is capitalized
  //display data in overview card
  //display data in 5 day forecast
  

  //save search term in object (only if success!)
    //properties:
      //current
      //search history[]

//fetch data
  //fetch current data
  //fetch 5 day
  //fetch uv index
function startGettingWeatherData(cityName) {
  const apiKey = '8364edf40aaaa47bca43e4b4901faf72';
  getCurrentWeather(cityName, apiKey);
}

function getCurrentWeather(cityName, apiKey) {
  const currentWeatherURL = getCurrentWeatherURL(cityName, apiKey);

  //object to pass data between fetches
  //once all fetches are done, this object will be
  //used to display data
  let weatherObj =
  {
    coord: {
      lon: '',
      lat: '',
    },
    cityName: properlyCapitalize(cityName),
    icon: '',
    description: '',
    temp: '',
    humidity: '',
    windSpeed: '',
    uvIndex: '',
  };

  fetch(currentWeatherURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data){
      if (data.hasOwnProperty('message') && data.hasOwnProperty('cod')) {
        let message = properlyCapitalize(data.message);
        showSearchError(message);
      } else {
        weatherObj.coord.lon = data.coord.lon;
        weatherObj.coord.lat = data.coord.lat;
        weatherObj.icon = data.weather[0].icon;
        weatherObj.description = data.weather[0].description;
        weatherObj.temp = data.main.temp;
        weatherObj.humidity = data.main.humidity;
        weatherObj.windSpeed = data.wind.speed;

        getUVIndex(weatherObj, apiKey);
      }
    });
}

function properlyCapitalize(str) {
  let copy = str;
  copy = copy.toLowerCase();
  return copy.charAt(0).toUpperCase() + copy.slice(1);
}

function getCurrentWeatherURL(cityName, apiKey) {
  return 'https://api.openweathermap.org/data/2.5/weather?'
    + `q=${cityName}`
    + '&units=imperial'
    + `&appid=${apiKey}`;
}

function getUVIndex(weatherObj, apiKey) {
  let currentWeather = weatherObj;
  const uvIndexURL = getUVIndexURL(
    currentWeather.coord.lat,
    currentWeather.coord.lon,
    apiKey);

  fetch(uvIndexURL)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      currentWeather.uvIndex = data.value;
      displayOverviewCard(weatherObj);
    });
}

function getUVIndexURL(lat, lon, apiKey) {
  return 'http://api.openweathermap.org/data/2.5/uvi?'
   + `lat=${lat}&lon=${lon}`
   + `&appid=${apiKey}`;
}

function displayOverviewCard(weatherObj) {
  const displayDiv = document.getElementById('display-info');
  const weather = weatherObj;
  let date = new Date();

  displayDiv.innerHTML =
    `<div class="card-body">
      <h2 class="d-inline-block mr-3">${weather.cityName} (${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})</h2>
      <img class="d-inline-block" src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}">
      <p>Temperature: ${weather.temp} &#176;F</p>
      <p>Humidity: ${weather.humidity}&#37;</p>
      <p>Wind Speed: ${weather.windSpeed} MPH</p>
      <p>UV Index: <span id="current-uv-index" class="bg-danger py-1 px-2 text-white rounded">${weather.uvIndex}</span></p>
    </div>`;
}

function getFiveDayForecastURL(cityName, apiKey) {
  return 'http://api.openweathermap.org/data/2.5/forecast?'
   + `q=${cityName}`
   + `&appid=${apiKey}`;
}

//on page load
  //grab the search object from local storage
  //display the overview info from current (make another fetch)
  //display search history
  //display 5 day forecast

  //if none
    //center text- enter city to see weather

//when city clicked in search history
  //if selection isn't current
    //make another fetch
    //display search history
    //display overview card
    //display 5 day forecast



