
var resultTextEl = document.querySelector('.card-title');
var tempEl = document.querySelector('#temp');
var humidEl = document.querySelector('#humid');
var windEl = document.querySelector('#wind');
var uvEl = document.querySelector('#uv');
var mainIcon = document.querySelector(".icontoday")
var citySearches = [];
var cityNames = [];
$(document).ready(function () {

    if (localStorage.getItem("locations") !== null) {

        var cities = JSON.parse(localStorage.getItem("locations"));
        console.log(cities)


        //let citiesEach = cities[0]
        for (i = 0; i < cities.length; i++) {
            $(".btn-group-vertical").append("<button type= 'button' class='citysearch' id='" + i +"'>" + cities[i] + "</button>")
            cityNames.push(cities[i]);
        }
        console.log(cityNames)


    };

});


function handleSearchFormSubmit(event) {
   event.preventDefault();

    var searchInputVal = document.querySelector("#search-input").value;
    console.log(searchInputVal);
    if (!searchInputVal) {
        alert('You need a search input value!');

        return;
    }
    cityNames.push(searchInputVal);
    $(".btn-group-vertical").append("<button type= 'button' class='citysearch' id='" + (cityNames.length - 1) + "'>" + searchInputVal + "</button>")
    resultTextEl.textContent = searchInputVal


    var queryString = 'http://api.positionstack.com/v1/forward?access_key=e1a330256e0a681d7bdee48bcc2240f7&query=' + searchInputVal + '&country=US&limit=1&fields=results.latitude,results.longitude'
    //
    console.log(queryString);
    getLocation(queryString)
}

function getLocation(queryString) {

    fetch(queryString)

        .then(function (resp) {

            return resp.json()

        }) // Convert data to json
        .then(function (data) {
            console.log(data);
            var lat = data.data[0].latitude;
            var lon = data.data[0].longitude;
            var newCity = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=aad99d1e4f7865403e9f1df2cd7d627c&units=imperial';
            citySearches.push(newCity);
            localStorage.setItem("locations", JSON.stringify(cityNames));

           
            console.log(newCity);
            fetchData(newCity);

       });

}

function fetchData(newCity) {
    fetch(newCity)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            console.log(data);
            var mainicon = data.current.weather[0].icon;
            var URLmain = "http://openweathermap.org/img/wn/" + mainicon + "@2x.png";
            tempEl.textContent = 'Temperature: ' + data.current.temp + '°F ';
            uvEl.textContent = 'UV Index: ' + data.current.uvi + '%';
            windEl.textContent = 'Wind Speed: ' + data.current.wind_speed + ' MPH';
            humidEl.textContent = 'Humidity: ' + data.current.humidity + '%';
            mainIcon.src = URLmain


            //if data.current.uvi 
            for (i = 0; i < 5; i++) {
                var time1000 = eval(data.daily[i].dt * 1000);
                var date = new Date(time1000);
                var newDate = date.toISOString().substring(5, 10);
                console.log(newDate);

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
                $(".icon")[i].src = URL

            }
            //var data}
            var time1000 = eval(data.daily[0].dt * 1000);
            var date = new Date(time1000);
            var todayDate = date.toISOString().substring(5, 10);
            $(".dateToday")[0].textContent = todayDate;



        })
        .catch(function (response) {
            alert("Please search again")
        });
  //searchCity();
}

// 

//function searchCity() {

    $(".btn-group-vertical").click(function (event) {
        var element = event.target;
        var searchInputValID = $(element).attr("id");
        console.log(searchInputVal)
        var getName = JSON.parse(localStorage.getItem("locations"))
        console.log(getName)

        var searchInputVal = getName[searchInputValID]
        resultTextEl.textContent = searchInputVal
        console.log(searchInputVal)
       queryString= 'http://api.positionstack.com/v1/forward?access_key=e1a330256e0a681d7bdee48bcc2240f7&query=' + searchInputVal + '&country=US&limit=1&fields=results.latitude,results.longitude'
       getLocation(queryString)

 })


document.querySelector(".d-flex").addEventListener('submit', handleSearchFormSubmit);







