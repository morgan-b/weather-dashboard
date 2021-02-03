// set variables for HTML elements
var resultTextEl = document.querySelector('.card-title');
var tempEl = document.querySelector('#temp');
var humidEl = document.querySelector('#humid');
var windEl = document.querySelector('#wind');
var uvEl = document.querySelector('#uv');
var mainIcon = document.querySelector(".icontoday");
var citySearches = [];
var cityNames = [];

//get local storage data if present and add to button group
$(document).ready(function () {

    if (localStorage.getItem("locations") !== null) {

        var cities = JSON.parse(localStorage.getItem("locations"));
        //add buttons for previous searches and add city searches to local storage
        for (i = 0; i < cities.length; i++) {
            $(".btn-group-vertical").append("<button type= 'button' class='btn btn-info btn-lg btn-block citysearch' id='" + i + "'>" + cities[i] + "</button>");
            cityNames.push(cities[i]);
        }

    }

});

// get user search value for city upon submitting it and get coordinates transferred into long and lat for openweather api
function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector("#search-input").value;
    //alert if no search and end search
    if (!searchInputVal) {
        alert('You need a search input value!');

        return;
    }
    //add buttons for each search term
    cityNames.push(searchInputVal);
    $(".btn-group-vertical").append("<button type= 'button' class='btn btn-info btn-lg btn-block citysearch' id='" + (cityNames.length - 1) + "'>" + searchInputVal + "</button>");
    resultTextEl.textContent = searchInputVal;

    var queryString = 'https://api.positionstack.com/v1/forward?access_key=e1a330256e0a681d7bdee48bcc2240f7&query=' + searchInputVal + '&country=US&limit=1&fields=results.latitude,results.longitude';
    getLocation(queryString);
}

// getch data for location of city from positionstack api and add coordinates to string for openweather api
function getLocation(queryString) {

    fetch(queryString)

        .then(function (resp) {
            // Convert data to json
            return resp.json();

        })
        .then(function (data) {
            console.log(data);
            var lat = data.data[0].latitude;
            var lon = data.data[0].longitude;
            var newCity = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=aad99d1e4f7865403e9f1df2cd7d627c&units=imperial';
            citySearches.push(newCity);
            localStorage.setItem("locations", JSON.stringify(cityNames));
            fetchData(newCity);

        });
        

}
// fetch data from openweather api 

function fetchData(newCity) {
    fetch(newCity)
        // Convert data to json
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            console.log(data);
            var mainicon = data.current.weather[0].icon;
            //add current weather to html
            var URLmain = "https://openweathermap.org/img/wn/" + mainicon + "@2x.png";
            tempEl.textContent = 'Temperature: ' + data.current.temp + '°F ';
            uvEl.textContent = 'UV Index: ' + data.current.uvi;
            windEl.textContent = 'Wind Speed: ' + data.current.wind_speed + ' MPH';
            humidEl.textContent = 'Humidity: ' + data.current.humidity + '%';
            mainIcon.src = URLmain;
            if (data.current.uvi <= 3) {
                uvEl.style.color = 'green';
            }
            else if (data.current.uvi > 3 && data.current.uvi <= 7) {
                uvEl.style.color = 'orange';
            }

            else if (data.current.uvi > 7) {
                uvEl.style.color = 'red';
            }
            //get date into a user friendly format
            for (i = 0; i < 5; i++) {
                var time1000 = eval(data.daily[i].dt * 1000);
                var date = new Date(time1000);
                var newDate = date.toISOString().substring(5, 10);
                console.log(newDate);

                $(".dayofweek")[i].textContent = newDate;


                // add in weather forecast to cards
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
                console.log(main);
                var URL = "https://openweathermap.org/img/wn/" + main + "@2x.png";
                $(".icon")[i].src = URL;

            }
            //get date for today into proper format and add to current weather html
            var time21000 = eval(data.daily[0].dt * 1000);
            var dateNew = new Date(time21000);
            var todayDate = dateNew.toISOString().substring(5, 10);
            $(".dateToday")[0].textContent = todayDate;



        })
        .catch(function () {
            alert("Please search again");
        });

}

//add listener event for when a user wants to re-search cities
$(".btn-group-vertical").click(function (event) {
    var element = event.target;
    var searchInputValID = $(element).attr("id");
    console.log(searchInputVal);
    var getName = JSON.parse(localStorage.getItem("locations"));
    console.log(getName);

    var searchInputVal = getName[searchInputValID];
    resultTextEl.textContent = searchInputVal;
    console.log(searchInputVal);
    queryString = 'https://api.positionstack.com/v1/forward?access_key=e1a330256e0a681d7bdee48bcc2240f7&query=' + searchInputVal + '&country=US&limit=1&fields=results.latitude,results.longitude';
    getLocation(queryString);

});

//add listener event for when a user submits a search

document.querySelector(".d-flex").addEventListener('submit', handleSearchFormSubmit);







