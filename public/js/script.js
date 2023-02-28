// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("App JS imported successfully!");
});

(function () {
  let map, smartCycleRestaurants;
  const mapEL = document.getElementById("map");
  const selectionMap = document.getElementById("selection-map");
  const currentUrl = window.location.href;
  const currentPath = currentUrl.split("/").pop();

  if (currentPath === 'restaurants') {
    const restaurantsData = document.getElementById("restaurants-data");
    smartCycleRestaurants = JSON.parse(restaurantsData.getAttribute("data-src"));
  }


  function initMap() {
    if (navigator.geolocation && mapEL) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        const currentLocation = { lat: latitude, lng: longitude };

        // initialize the map
        map = new google.maps.Map(mapEL, {
          center: currentLocation,
          zoom: 15
        });

        // get the nearby places
        const places = new google.maps.places.PlacesService(map);
        places.nearbySearch(
          {
            location: currentLocation, // current location
            radius: 1000, // 1000 meters
            type: ["restaurant"],
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              results.forEach(place => {
                // display the marker
                displayMarker(place);
              });
            }
          }
        );


        if (smartCycleRestaurants.length) {
          smartCycleRestaurants.forEach(restaurant => {
            const marker = new google.maps.Marker({
              position: restaurant.location,
              map: map,
              title: restaurant.title,
              icon: {
                url: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/restaurant-66-233145.png?f=avif&w=256',
                scaledSize: new google.maps.Size(30, 30)
              }

            });
            marker.addListener("click", () => {
              const infowindow = new google.maps.InfoWindow();
              const content = `
              <div id=${restaurant?._id} style="max-width:200px">
                <h5>${restaurant?.title}</h5> 
                <p style="margin-top:5px;" class="mb-0"><b>Contact:</b> ${restaurant?.phoneNumber} </p>
                <p style="margin-top:5px;" class="mb-0"><b>Type:</b> ${restaurant?.foodTypes.join(', ')} </p>
                <p style="margin-top:5px;" class="mb-0">${restaurant?.address?.street}, ${restaurant?.address?.state}, ${restaurant?.address?.city}, ${restaurant?.address?.zip}</p>
              </div>
              `;
              infowindow.setContent(content);
              infowindow.open(map, marker);
            });
          });
        }

        // display the marker
        const displayMarker = (location) => {
          let marker;
          marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            title: location.name,
          });
          marker.addListener("click", () => {
            const infowindow = new google.maps.InfoWindow();
            const content = displayRestaurantPopup(location);
            infowindow.setContent(content);
            infowindow.open(map, marker);
            getFormattedPhoneNumber(location.place_id);
          });
        };
        // unobserve

      }, function (error) {
        console.log('error: ', error);
      }, {
        enableHighAccuracy: true,
      });
    }
  }

  const displayRestaurantPopup = (location) => {
    return `
      <div id=${location.place_id} style="max-width:200px">
        <h5>${location.name}</h5> 
        <div class="images">
          ${location?.photos?.length ?
        location?.photos?.map(photo => `<a href=${photo.getUrl()} target="_blank"><img src="${photo.getUrl()}" alt="${location.name}" width="50px"></a>`).join("") : ''}
        </div>
        <p style="margin-top:5px;" class="mb-0">${location?.vicinity}</p>
      </div>
    `;
  }

  const getFormattedPhoneNumber = (placeId) => {
    setTimeout(() => {
      const popup = document.querySelectorAll(`#${placeId}`);
      if (popup) {
        const service = new google.maps.places.PlacesService(map);
        service.getDetails({
          placeId: placeId,
          fields: ['formatted_phone_number']
        }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (place.formatted_phone_number) {
              const contactNo = document.createElement("p");
              contactNo.style.marginTop = "5px";
              contactNo.innerHTML = `<b>Contact</b>: ${place.formatted_phone_number}`;
              popup[0].appendChild(contactNo);
            }
          }
        });
      }
    }, 100);
  }

  // initialize the map
  if (mapEL) {
    initMap();
  }

  if (selectionMap) {
    console.log('selectionMap: ', selectionMap);
    initializeSelectionMap();
  }

  function initializeSelectionMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        const currentLocation = { lat: latitude, lng: longitude };
        map = new google.maps.Map(selectionMap, {
          center: currentLocation,
          zoom: 15
        });

        const marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
        });

        // add a maker on click
        google.maps.event.addListener(map, 'click', function (event) {
          placeMarker(event.latLng);
        });
        function placeMarker(location) {
          marker.setPosition(location);
          const latitude = location.lat();
          const longitude = location.lng();
          const lat = document.getElementById("latitude");
          const lng = document.getElementById("longitude");
          lat.value = latitude;
          lng.value = longitude;

        }
      });
    }
  }


})();