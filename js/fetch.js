// API INIT
const APIKey = "e2a4a9658b208384b632270dff3ae3a2";

const requestCity = async (city) => {
    const baseURL = `https://api.openweathermap.org/data/2.5/forecast`
    const query = `?q=${city}&appid=${APIKey}`;

    $.get(baseURL + query, function (data, status) {
        console.log(data);

        //Info to be grabbed from API
        var cityName = data.city.name;
        var temp = Math.round((data.list[0].main.temp - 273.15) * 1.8 +32);
        var humidity = data.list[0].main.humidity
        var windSpeed = data.list[0].wind.speed.toFixed(1)
        var date = data.list[0].dt_txt 
        // var uvIndex = data.list[0].

        // console.log(humidity, windSpeed, date)

        //Init changes function
        change(cityName, temp, humidity, windSpeed, date)

        //Init History Array Function
        history(cityName)

        //UV FETCH
        let UVAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&exclude={part}&appid=${APIKey}`;

        // UV Call
        $.ajax({
            url: UVAPI,
            method: "GET"
        }).then(function(UVData){
            console.log(UVData)
            $("#UV").html(`${UVData.current.uvi}`)
            if(UVData.current.uvi < 4){
                $("#UV").addClass("lowUV")
            }else if(UVData.current.uvi < 6){
                $("#UV").addClass("mediumUV")
            }else{
                $("#UV").addClass("highUV")
            }
            
            //Five Day Forecast
            let forecastArray = [1,2,3,4,5]
            forecastArray.forEach(function(i){
                let forecastDate = (new Date(UVData.daily[i].dt * 1000));
                console.log(forecastDate.toDateString().slice(0,3));

                $(`#date${i}`).html(`${(new Date(UVData.daily[i].dt * 1000)).toDateString().slice(0,3)}`);

                $(`.humidity${i}`).html(`Humidity: ${UVData.daily[i].humidity}%`);

                $(`.temp${i}`).html(`${((UVData.daily[i].temp.min- 273.15)*1.8+ 32).toFixed(0)}-${((UVData.daily[i].temp.max- 273.15)*1.8+ 32).toFixed(0)} °F`);
            })
        })
    });
}

//need to grab value from imput to pass into requestCity function 
$("#SearchBar").on("change", s =>{
    s.preventDefault();
    var Searched = $("#SearchBar").val();
    requestCity(Searched);
});

// Changes finction will append data to page
function change(cityName, temp, humidity, windSpeed, date){
    $("#LocalDate").html(`${cityName} (${date.slice(5,7)}/${date.slice(8,10)}/${date.slice(0,4)})`);
    $("#temp").html(`Temperature: ${temp} °F`);
    $("#humidity").html(`Humidity: ${humidity}%`)
    $("#windSpd").html(`Wind Speed: ${windSpeed} MPH`)
}

//History function 
function history(cityName){
    //create and array and append city to array and loop through, set limit to 5, each new instance set to start of array, for each create a button 
    // console.log(cityName)
}