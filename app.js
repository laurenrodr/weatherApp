//uses https://darksky.net/dev for weather api
//uses https://cors-anywhere.herokuapp.com/ for proxy
//uses https://github.com/darkskyapp/skycons for icons
window.addEventListener("load", function(){
    document.getElementsByClassName("preload")[0].style.visibility = "visible";
    let lon;
    let lat;
    let tempDesc = document.querySelector('.temp-desc');
    let tempDegrees = document.querySelector('.temp-degrees');
    let locationTimezone = document.querySelector('.location-timezone');
    let degreesSection = document.querySelector('.degrees');
    const tempSpan = document.querySelector('.degrees span');
    let riseTime = document.querySelector('.sunrise');
    let setTime = document.querySelector('.sunset');

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            console.log("lon: " + lon);
            console.log("lat: " + lat);


            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.darksky.net/forecast/1ca47e16f27bc9d6c9f9a13024ad1a88/${lat},${lon}`;

            fetch(api)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    console.log(data);
                    const {temperature, summary, icon} = data.currently;

                    //set DOM elements from darksky API
                    tempDegrees.textContent = Math.floor(temperature);
                    tempDesc.textContent = summary;
                    locationTimezone.textContent = data.timezone;


                    //set icon
                    setIcons(icon, document.querySelector(".icon"))

                    //hides weather information until geolocation is found
                    document.getElementsByClassName("preload")[0].style.visibility = "hidden";
                    document.getElementsByClassName("main-content")[0].style.visibility = "visible";

                    //Celsius Formula
                    //here temperature = farenheit
                    let celsius = (temperature - 32) * (5 / 9);

                    //change temperature to Celsius
                    degreesSection.addEventListener('click', function(){
                        if(tempSpan.textContent === "F"){
                            tempSpan.textContent = "C";
                            tempDegrees.textContent = Math.floor(celsius);
                        }
                        else {
                            tempSpan.textContent = "F";
                            tempDegrees.textContent = Math.floor(temperature);
                        }
                    });
                    setRise(lat, lon);
                });
        });
    }

    function setRise(lat, lon){
        //fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today`)
        fetch(`https://api.sunrise-sunset.org/json?lat=25.7742658&lng=-80.1936589&formatted=0`)
            .then(function(response){
                return response.json();
            })
            .then(function(sun){
                const {sunrise, sunset} = sun.results;
                let utcRise = sunrise;
                let utcSet = sunset;

                let rise = new Date(utcRise);
                let set = new Date(utcSet);

                riseTime.textContent = rise.toString().substring(16, 21);
                setTime.textContent = set.toString().substring(16, 21);
            })
    }

    function setIcons(icon, iconID){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});
