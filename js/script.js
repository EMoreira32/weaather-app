$(document).ready(function() {

    // search button function
    $("#searchbutton").on("click", function(input) {

        // sets what the user searched for as a variable
        var input = $("#search").val();

        // saves the searched-for city in local storage
        localStorage.setItem("city:", input);

        // sets the locally stored cities to list elements
        var history = $("<li>").addClass("list-group-item list-group-item-action").text(localStorage.getItem("city:"))

        // adds new list elements to the beginning of the history list
        $(".historylist").prepend(history);

        // ajax call that gets city's current weather info
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=77d824887f06ac6836449d9d10feb418&units=imperial",
            dataType: "json",
            success: (function(data) {
                // empties the current day's div if there is already a city listed
                $(".currentday").empty();

                // variables for the UV index URL parameters
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;

                // variables for the current weather conditions
                var currentCity = $("<h2>").addClass("card-current").text(data.name + " (" + new Date().toLocaleDateString() + ")");
                var currentTemp = $("<p>").text("Temperature: " + data.main.temp + "°F");
                var currentHumid = $("<p>").text("Humidity: " + data.main.humidity + "%");
                var currentWind = $("<p>").text("Wind Speed: " + data.wind.speed + "MPH");

                // the card's body
                var cardInfo = $("<div>").addClass("card-body");

                // the card
                var addCard = $("<div>").addClass("card");

                // adds the card to the currentday div
                $(".currentday").append(addCard);

                // ajax call that gets the UV info
                $.ajax({
                    type: "GET",
                    url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=77d824887f06ac6836449d9d10feb418",
                    dataType: "json",
                    success: (function(data) {
                        // text that labels the UV index button
                        var currentUV = $("<p>").text("UV Index: ");
                        // adds the UV index button
                        var uvButton = $("<button>").addClass("button").text(data.value);
                        // adds the UV index value to the button
                        currentUV.append(uvButton)
                        // adds all the weather info to the card body
                        cardInfo.append(currentCity, currentTemp, currentHumid, currentWind, currentUV);
                        // adds the card body's info to the card
                        addCard.append(cardInfo);

                        // changes UV button colors based on UV index value
                        // red - severe
                        if (data.value >= 6.65) {
                            uvButton.addClass("btn btn-danger");
                        }
                        // yellow - moderate
                        else if (data.value < 6.65 && data.value > 3.34) {
                            uvButton.addClass("btn btn-warning");
                        }
                        // green - favorable
                        else {
                            uvButton.addClass("btn btn-success");
                        }

                    })
                })
            })
        })


        // five day forecast function
        function getFiveDay(input) {
            // ajax call that gets the city's five-day forecast
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=77d824887f06ac6836449d9d10feb418&units=imperial",
                dataType: "json",
                success: (function(data) {
                    // deletes forecasts from the previous search
                    $(".fiveday").empty();
                    // loops through the forecast object to add cards
                    for (var i = 0; i < data.list.length; i++) {
                        // only grabs data from the forecast object after 3pm since there are three arrays for each day
                        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                            // gets the date
                            var todaysDate = new Date(data.list[i].dt_txt).toLocaleDateString();
                            // card
                            var fiveCard = $("<div>").addClass("card bg-primary mb-3 text-white");
                            // card body
                            //var fiveCardBody = $("<div>").addClass("card-body p-2");
                            // weather icons
                            var icon = $("<img>").addClass("card-img").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                            // changes the dt code to a readable date
                            var date = $("<h5>").addClass("card-title date text-center").text(todaysDate);
                            // temperatures
                            var temp = $("<p>").addClass("card-text temp").text("Temp: " + data.list[i].main.temp + "°F");
                            // humidities
                            var humid = $("<p>").addClass("card-text humid").text("Humidity: " + data.list[i].main.humidity + "%");
                            // adds columns for the cards to go in
                            var columns = $("<div>").addClass("col");
                            // adds info to card's bodies
                            columns.append(fiveCard.append(date, icon, temp, humid)); //.append(fiveCardBody)
                            // adds cards to fiveday div
                            $(".fiveday").append(columns);
                        }
                    }
                })
            })
        }

//function calls
        getFiveDay(input);

    })
})
   