//uses https://darksky.net/dev for weather api
//uses https://cors-anywhere.herokuapp.com/ for proxy
//uses https://github.com/darkskyapp/skycons for icons
window.addEventListener("load", function(){
    let lon;
    let lat;
    let tempDesc = document.querySelector('.temp-desc');
    let tempDegrees = document.querySelector('.temp-degrees');
    let locationTimezone = document.querySelector('.location-timezone');
    let degreesSection = document.querySelector('.degrees');
    const tempSpan = document.querySelector('.degrees span')
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            document.getElementsByClassName("preload")[0].style.visibility = "visible";
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.darksky.net/forecast/1ca47e16f27bc9d6c9f9a13024ad1a88/${lat},${lon}`;

            fetch(api)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
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
                            tempDegrees.textContent = temperature;
                        }
                    });
                });
        });
    }

    function setIcons(icon, iconID){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});
