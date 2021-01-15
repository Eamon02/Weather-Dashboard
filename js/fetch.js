// API INIT
const APIKey = "e2a4a9658b208384b632270dff3ae3a2";

const requestCity = async (city) => {
    const baseURL = `https://api.openweathermap.org/data/2.5/forecast`
    const query = `?q=${city}&appid=${APIKey}`;

    $.get(baseURL + query, function (data, status) {
        console.log(data);
        console.log(data.list[0].weather[0].description)

        //Info to be grabbed from API
        var cityName = data.city.name;
        var temp = Math.round((data.list[0].main.temp - 273.15) * 1.8 +32);
        var humidity = data.list[0].main.humidity
        var windSpeed = data.list[0].wind.speed.toFixed(1)
        var date = data.list[0].dt_txt 
        var wDescription = data.list[0].weather[0].description
        var icon = data.list[0].weather[0].icon

        // console.log(humidity, windSpeed, date)

        //Init changes function
        change(cityName, temp, humidity, windSpeed, date, icon)

        //Init History Array Function
        history(cityName)

        //Changes background based on weather
        backgroundWeather(wDescription)

        //UV FETCH
        let UVAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&exclude={part}&appid=${APIKey}`;

        // UV Call
        $.ajax({
            url: UVAPI,
            method: "GET"
        }).then(function(UVData){
            // console.log(UVData)
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
                // console.log(forecastDate.toDateString().slice(0,3));

                $(`#date${i}`).html(`${(new Date(UVData.daily[i].dt * 1000)).toDateString().slice(0,3)}`);

                $(`.humidity${i}`).html(`Humidity: ${UVData.daily[i].humidity}%`);

                $(`.temp${i}`).html(`${((UVData.daily[i].temp.min- 273.15)*1.8+ 32).toFixed(0)}-${((UVData.daily[i].temp.max- 273.15)*1.8+ 32).toFixed(0)} °F`);
                $(`.icon${i}`).attr("src", `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`)
                $(`.wD${i}`).html(`${data.list[i].weather[0].description}`)
            })
        })
    });
}

//need to grab value from imput to pass into requestCity function 
$("#searchBtn").on("click", s =>{
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

// Background change based on weather description
function backgroundWeather(wDescription){
    $("body").removeClass()
    $("body").toggleClass(wDescription)
}

var historyArray = []
//History function 
function history(cityName){
    for (i = 0; i < 4; i++){
        if(historyArray[i] === cityName){
            return
        }
    }
    
        if (historyArray.length < 4){
            historyArray.unshift(cityName)
        
        }else{
            historyArray.pop()
            historyArray.unshift(cityName)
        }
        console.log(historyArray)
        localStorage.setItem("History", JSON.stringify(historyArray))

        for (i = 0; i < 4; i++){
            $(`#history${i+1}`).html(historyArray[i])
                
            }

}

//Fill History
fillHistory()
function fillHistory(){
    // set alert if array empty
    let loadArray = localStorage.getItem("History", historyArray)
    historyArray = JSON.parse(loadArray)
    if(historyArray === null){
        requestCity("Greenwich")
        historyArray = ["Greenwich"]
        //or launch error
    }else{

    for (i = 0; i < 4; i++){
        $(`#history${i+1}`).html(historyArray[i])
        }
        //Fills in based on previous search
        requestCity(historyArray[0]);
    }
}

//click feature -add event listnered this.text() -> pass into Requestcity funct


