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

        console.log(temp)

        //Init changes function
        change(cityName, temp)

        //Init History Array Function
        history(cityName)
    });
}

//need to grab value from imput to pass into requestCity function 
$("#SearchBar").on("change", s =>{
    s.preventDefault();
    var Searched = $("#SearchBar").val();
    requestCity(Searched);
});

// Changes finction will append data to page
function change(cityName, temp){
    $("#LocalDate").html(cityName);
    $("#temp").html(`Temperature: ${temp} °F`);
}

//History function 
function history(cityName){
    //create and array and append city to array and loop through, set limit to 5, each new instance set to start of array, for each create a button 
    console.log(cityName)
}


// const forecast = async (city) => {
//     const baseURL = `https://api.openweathermap.org/data/2.5/forecast`
//     const query = `?q=${city}&appid=${APIKey}`;

//     $.get(baseURL + query, function (data, status) {
//         console.log(data);
//     });
// }