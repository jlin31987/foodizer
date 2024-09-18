var totalRange = 500;
var userLocation = null;

function updateRangeValue() {
    totalRange = parseInt(document.getElementById("rangeInput").value);
    document.getElementById("rangeValue").textContent = totalRange;
    findNearbyRestaurants();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            document.getElementById("location").innerHTML = "Latitude: " + userLocation.latitude + "<br>Longitude: " + userLocation.longitude;
            findNearbyRestaurants();
        }, function (error) {
            alert("Error getting your location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function findNearbyRestaurants() {
    if (userLocation) {
        var apiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${totalRange},${userLocation.latitude},${userLocation.longitude})['amenity'='restaurant'];out;`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayResults(data.elements))
            .catch(error => console.error('Error fetching data:', error));
    } else {
        alert("Please allow access to your location.");
    }
}

function displayResults(restaurants) {
    var resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h2>Nearby Restaurants:</h2>";

    if (restaurants.length === 0) {
        resultsDiv.innerHTML += "<p>No restaurants found nearby.</p>";
        return;
    }

    var maxResults = 10;
    var shownResults = 0;

    for (var i = 0; i < restaurants.length; i++) {
        var restaurantName = restaurants[i].tags.name;
        if (restaurantName) {
            var restaurantElement = document.createElement("div");
            restaurantElement.innerHTML = "<p>" + restaurantName + "</p>";
            resultsDiv.appendChild(restaurantElement);
            shownResults++;
            if (shownResults === maxResults) {
                break;
            }
        }
    }

    if (shownResults === 0) {
        resultsDiv.innerHTML += "<p>No named restaurants found nearby.</p>";
    }
}

function animateRandomSelection() {
    var restaurants = document.querySelectorAll("#results div");

    if (restaurants.length === 0) {
        alert("No restaurants to select from.");
        return;
    }

    // Add animation class to all restaurant elements
    for (var i = 0; i < restaurants.length; i++) {
        restaurants[i].classList.add("animate-selection");
    }

    // Wait for the animation to complete (1 second), then pick a random restaurant
    setTimeout(function () {
        var randomIndex = Math.floor(Math.random() * restaurants.length);
        alert("Randomly selected restaurant: " + restaurants[randomIndex].querySelector("p").textContent);
        // Remove animation class from all restaurant elements
        for (var i = 0; i < restaurants.length; i++) {
            restaurants[i].classList.remove("animate-selection");
        }
    }, 1000);
}
