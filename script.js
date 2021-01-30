
var resultTextEl = document.querySelector('.card-title');
var tempEl = document.querySelector('#temp');
var humidEl = document.querySelector('#humid');
var windEl = document.querySelector('#wind');
var uvEl = document.querySelector('#uv');
var citySearches = [];
var cityNames = [];
let weatherType = ["Thunderstorm", "Drizzle", "Rain", "Snow", "Mist", "Smoke", "Haze", "Dust", "Fog", "Sand", "Dust", "Ash", "Squall", "Tornado"]
let weatherIcon = ["11d","09d","10d","13d","50d","50d","50d","50d","50d","50d","50d","50d","50d","50d",]
let iconURL = "http://openweathermap.org/img/wn/"
function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector("#search-input").value;
    // var formatInputVal = document.querySelector('#format-input').value;
    console.log(searchInputVal);
    // if (!searchInputVal) {
    //  console.error('You need a search input value!');
    //  return;
    // }
    resultTextEl.textContent = searchInputVal
    cityNames.push(searchInputVal);

    var queryString = 'http://api.positionstack.com/v1/forward?access_key=e1a330256e0a681d7bdee48bcc2240f7&query=' + searchInputVal + '&country=US&limit=1&fields=results.latitude,results.longitude'
    //
    console.log(queryString);

    fetch(queryString)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            console.log(data);
            var lat = data.data[0].latitude;
            var lon = data.data[0].longitude;
            var newCity = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=aad99d1e4f7865403e9f1df2cd7d627c&units=imperial';
            citySearches.push(cityNames);
            fetchData(newCity);
            console.log(newCity);
        });

    function fetchData(queryString) {
        fetch(queryString)
            .then(function (resp) { return resp.json() }) // Convert data to json
            .then(function (data) {
                console.log(data);

                tempEl.textContent = 'Temperature: ' + data.current.temp + '°F ';
                uvEl.textContent = 'UV Index: ' + data.current.uvi + '%';
                windEl.textContent = 'Wind Speed: ' + data.current.wind_speed + ' MPH';
                humidEl.textContent = 'Humidity: ' + data.current.humidity + '%';
                for (i = 0; i < 5; i++) {
                    var time1000 = eval(data.daily[i].dt * 1000);
                    var date = new Date(time1000);
                    var newDate = date.toISOString().substring(5, 10);
                    $(".dayofweek")[i].textContent = newDate;


                }
                for (i = 0; i < 5; i++) {
                    var temp = 'Temperature: ' + (data.daily[i].temp.max) + '°F ';
                    $(".tempday")[i].textContent = temp;
                }
                for (i = 0; i < 5; i++) {
                    var humid = 'Humidity: ' + (data.daily[i].humidity) + '% ';
                    $(".humidday")[i].textContent = humid;
                }
                for (i = 0; i < 5; i++) {
                    var main = data.daily[i].weather[0].icon;
                    console.log(main)
                    var URL = "http://openweathermap.org/img/wn/" + main + "@2x.png"
                    $(".icon")[i].src =  URL 
                    
                }
                //var data}
                var time1000 = eval(data.daily[0].dt * 1000);
                var date = new Date(time1000);
                var newDate = date.toISOString().substring(5, 10);
                resultTextEl.append(" " + newDate)
               

            })

    }
}


//







//.catch(function () {
// catch any errors
//});














document.querySelector(".d-flex").addEventListener('submit', handleSearchFormSubmit);
