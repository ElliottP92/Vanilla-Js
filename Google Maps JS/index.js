let map;
let markers = [];
let infoWindow;
// Controls the starting point
function initMap() {
    let charlotte = {
        lat: 35.227085,
        lng: -80.843124
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: charlotte,
        zoom: 8
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}
// Ways a user can search stores 
function searchStores(){
    let foundStores = [];
    let zipCode = document.getElementById('zip-code-input').value;
    let bussniessType = document.querySelector(".store-type").value;
    let storeNames = document.querySelector(".store-name").value;
    if(bussniessType){
        stores.forEach(function(store){
            let brandType = store.brandType;
            if(bussniessType === brandType){
                foundStores.push(store);
            }
        });
    } if(zipCode){
        stores.forEach(function(store){
            let postal = store.address.postalCode;
            if(postal === zipCode){
                foundStores.push(store);
            }
        });
    } if(storeNames){
        stores.forEach(function(store){
            let nameStore = store.name;
            if(storeNames === nameStore){
                foundStores.push(store);
            }
        });
    } else {
        foundStores = stores;
    }
    clearLocations()
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

document.addEventListener("keydown", event => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      searchStores();
    }
  });


function clearLocations() {
    infoWindow.close();
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

// Events for whe a user is over a store
function setOnClickListener() {
    let storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('mouseover', function(){
            google.maps.event.trigger(markers[index], 'mouseover');
        })
    });
}

// Displays of the stores 
function displayStores(stores) {
    let storesHtml = "";
    stores.forEach(function(store, index){
        let address = store.addressLines;
        let phone = store.phoneNumber;
        let latAndLong = new google.maps.LatLng(
            parseFloat(store.coordinates.latitude),
            parseFloat(store.coordinates.longitude));
        let placeId = store.placeId;
        let storeName = store.name;
        let storeType = store.storeType;
        storesHtml += `
    <div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                 <div class="store-name">
                    ${storeName}
                 <div class="store-type"> ${storeType}</div>
                 <div class="store-address">
                    <span><a href="https://www.google.com/maps/search/?api=1&query=${latAndLong}&query_place_id=${placeId}"/a>${address[0]}</span>
                 </div>
                 <div class="store-phone-number">${phone}</div>
                 </div>
                 </div>
                 <div class="store-number-container">
                <div class="store-number">
                ${index+1}
                </div>
            </div>
        </div>
    </div>
    `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

// Markers for each store
function showStoresMarkers(stores) {
    let bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index){
        let latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        let name = store.name;
        let address = store.addressLines[0];
        let statusText = store.openStatusText;
        let phone = store.phoneNumber;
        let latAndLong = new google.maps.LatLng(
            parseFloat(store.coordinates.latitude),
            parseFloat(store.coordinates.longitude));
        let placeId = store.placeId;
        bounds.extend(latlng);
        createMarker(latlng, name, address, statusText, phone, index,latAndLong,placeId);
    })
    map.fitBounds(bounds);
}

// The info for each store when attached to a marker
function createMarker(latlng, name, address, statusText, phone, index,latAndLong,placeId) {
    let html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${statusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=${latAndLong}&query_place_id=${placeId}"/a>${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phone}
            </div>
        </div>
    `;
    let marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'mouseover', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}






   
    