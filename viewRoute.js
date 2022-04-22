/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the viewRoute.html file
*/

var routeToLoadRef = document.getElementById("routeToLoad");
var routeNameDisplayRef = document.getElementById("routeNameDisplay");
var routeShipRef = document.getElementById("routeShip");
var routeStartDateRef = document.getElementById("routeStartDate");
var routeStartPortRef = document.getElementById("routeStartPort");
var routeEndPortRef = document.getElementById("routeEndPort");
var routeDurationRef = document.getElementById("routeDuration");
var routeCostRef = document.getElementById("routeCost");
var routeDistanceRef = document.getElementById("routeDistance");
var toastRef = document.getElementById("toast");

// variable to hold a list of markers to allow ease of manipulation (deletion) whenever a different route is selected
var markerArray = [] 

// Mapbox key
mapboxgl.accessToken = 'pk.eyJ1IjoiZGlzdGFyZXJpYSIsImEiOiJja2VnbmxpNmwweWdiMnpwcXlmYWQ0NjBsIn0.RRK0LyUztj4_h0q6jtpReA';

// Creates the map to display on the page
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    zoom: 8,
});
    
/******************************************************************************************
This function is called on page load. It first does a preliminary check if local storage
is available on the device and send an alert to notify the user if it is not.
Otherwise it checks if the key "routeList" exists wthin local storage and if not, alerts the
user that no routes currently exist.

If it does, it then populates the route selection choices on the screen by creating 
many option elements and appending them onto the html.

Inputs:
- None
Returns:
- Alerts the user if local storage is not available Or populates the route choices if it is
and there is at least a route in local storage
******************************************************************************************/
function getRouteList()
{
    if (typeof(Storage) !== "undefined")
    {
        if (localStorage.getItem("routeList") !=null )
        {
            let routeListJSON =JSON.parse(localStorage.getItem("routeList"));
            let currentRouteList = new RouteList();
            currentRouteList._initialiseFromRouteListPDO(routeListJSON);
            let routes = currentRouteList.getRouteList();
            for (let i = 0; i < routes.length; i++)
            {
                let tempString = routes[i].getRouteName();
                let element = document.createElement("option");
                element.textContent = tempString;
                element.value = tempString;
                routeToLoadRef.appendChild(element);
            }    
        }
        else
        {
            alert("Oops! No routes currently exist");
            toastRef.innerText = "Oops! No routes currently exist";
        }
    }
    else
    {
        alert("Please change to a different device your current device does not support local storage. Thank you!");  
    }
}

/******************************************************************************************
This function is called onchange of the route selection by the user. It takes in the element
and gets the value associated with it which would be the name of the route.
It first checks if any markers are present on the map, and deletes them if they are. This occurs 
when the user switches to view another route.

It then takes the name of the route and gets the route object. It then outputs the relavant
details to the screen. It also makes a function call to move the map view to the starting port,
and another function call to place the markers and draw out the route.

Inputs:
- An element (routeToLoad)
Returns:
- Displays the route information and map
******************************************************************************************/
function findRoute(element)
{
    toastRef.innerText="";
    if (markerArray.length > 0)
    {
        for (let i =0; i < markerArray.length; i++)
        {
            markerArray[i].remove();
        }
    }
    // makes the mdl card, delete button and map visible
    document.getElementById("deleteRoute").style.visibility = "visible";
    document.getElementById("displayCard").style.visibility = "visible";
    document.getElementById("map").style.visibility= "visible";
    let routeName = element.value;
    let foundRoute = new Route(routeName);
    foundRoute._findRouteObject(routeName);
    routeNameDisplayRef.innerHTML = foundRoute.getRouteName();
    routeShipRef.innerHTML ="Ship: " +  foundRoute.getShip().getShipName();
    routeStartDateRef.innerHTML = "Start Date: " + foundRoute.getStartDate();
    routeStartPortRef.innerHTML = "Origin Port: " + foundRoute.getSourcePort().getPortName();
    routeEndPortRef.innerHTML = "Destination Port: " + foundRoute.getDestinationPort().getPortName();
    routeDurationRef.innerHTML = "Route Duration: " + foundRoute.getTime() + " days";
    routeCostRef.innerHTML = "Total Cost: " + foundRoute.getCost() + " units";
    routeDistanceRef.innerHTML = "Distance: " + foundRoute.getDistance() + " km";
    panToPort(foundRoute.getSourcePort()); //pans the map to the source port
    placeMarkers(foundRoute);
}

/******************************************************************************************
This function takes a route object, places markers for the source port, destiantion port and 
all of the way points. It then makes a call to the showPath() function, passing it the entire 
list of waypoints from the route.

Inputs:
- A route object
Returns:
- Displays the
******************************************************************************************/
function placeMarkers(aRoute)
{
    let sourcePort = new Port("tempPort");
    sourcePort = aRoute.getSourcePort();
    let destPort = new Port("tempPort");
    destPort = aRoute.getDestinationPort();
    var startingPortMarker = new mapboxgl.Marker({color: "#32CD32"}) //green color
        .setLngLat([sourcePort.getLng(), sourcePort.getLat()])
        .setPopup(new mapboxgl.Popup().setHTML("Port " + sourcePort.getPortName()).addTo(map))
        .addTo(map)
        .togglePopup(); 
    markerArray.push(startingPortMarker);
    var endingPortMarker = new mapboxgl.Marker({color: "#DC143C"}) //red color
        .setLngLat([destPort.getLng(), destPort.getLat()])
        .setPopup(new mapboxgl.Popup().setHTML("Port " + destPort.getPortName()).addTo(map))
        .addTo(map)
        .togglePopup();
    markerArray.push(endingPortMarker);
    //for loop places markers for each waypoint
    let wayPointList = aRoute.getWayPointList();
    for (let i = 0; i < wayPointList.length; i++)
    {
        let waypoint = new mapboxgl.Marker({color: "#FF8C00"}) //orange color
            .setLngLat([wayPointList[i][0], wayPointList[i][1]])
            .addTo(map)
        markerArray.push(waypoint);
    }
    wayPointList.unshift([sourcePort.getLng(), sourcePort.getLat()]); // adds the coordinates of the source port to the start of the waypoint list
    wayPointList.push([destPort.getLng(), destPort.getLat()]); // adds the coordinates of the destination port to the end of the waypoint list
    showPath(wayPointList);
}

/******************************************************************************************
This function takes a portname as input, gets the corresponding port object and pans
the map to the location of the port.
******************************************************************************************/
function panToPort(aPort)
{
    map.panTo([aPort.getLng(), aPort.getLat()], {zoom:5});
}

/******************************************************************************************
This function takes an array of arrays with each inner array containing latitude and longitude 
coodinates which represent waypoints. It then draws a GEOJSON line on the map that connects 
all of the coordinates given.

Inputs:
- An array of arrays containing a list of coordinates
Returns:
- Draws a GEOJSON line on the map
******************************************************************************************/
function showPath(latLngList)
{
    removeLayerWithId('route') // removes any previous lines drawn on the map, such as when the user picks a new route to show
    map.addLayer({
        id: 'route',
            type: 'line',
            source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                type: 'LineString',
                coordinates: latLngList
                }
            }
            },
            layout: {
            'line-join': 'round',
            'line-cap': 'round'
            },
        paint: {
            'line-color': '#808080',
            'line-width': 8
        }
    });
}

/******************************************************************************************
This function takes a string which specifies an id that is to be removed from the map.

Inputs:
- A string (id)
Returns:
- Removes the layer with the specified id from the map if it exists
******************************************************************************************/
function removeLayerWithId(idToRemove)
{
    let toCheck = map.getLayer(idToRemove);
    if (toCheck !== undefined)
    {
        map.removeLayer(idToRemove);
        map.removeSource(idToRemove);
    }
}

/******************************************************************************************
This function is called when the user clicks the edit start date option. It will check 
if the current system date is before the route start date and enables the option to 
select a new start date if true. Otherwise it will change the toast message to inform
the user it is not possible to change the date.
******************************************************************************************/
function enableEdit()
{
    let routeName = document.getElementById("routeToLoad").value;
    let routeToEdit = new Route(routeName);
    routeToEdit._findRouteObject(routeName);
    let dateToCheck = routeToEdit.getStartDate();
    let today = new Date();
    let dateToCompare = new Date (dateToCheck.slice(0,4), dateToCheck.slice(5,7)-1, dateToCheck.slice(8));
    if (today < dateToCompare)
    {
        document.getElementById("editStartDateDiv").style.visibility = "visible";
        toastRef.innerText = "";
    }
    else
    {
        toastRef.innerText = "Unable to edit start date as route has already begun!";
    }
}


/******************************************************************************************
This function is called on change of the date selection. It passes the selection element
to the function, which takes the value as the date to check against the current system
date. If the date selected is in the future to the current date, it then makes visible
the edit button for the user to click. Otherwise it displays an error message in the toast
label.

Inputs:
- An element (editStartDate)
Returns:
- Removes the layer with the specified id from the map if it exists
******************************************************************************************/
function enableButton(element)
{
    let dateString= element.value;
    let today = new Date();
    let dateToCompare = new Date (dateString.slice(0,4), dateString.slice(5,7)-1, dateString.slice(8));
    
    if (today < dateToCompare)
    {
        document.getElementById("updateDate").style.visibility= "visible";
        toastRef.innerText = "";
    }
    else
    {
        toastRef.innerText = "Please select a date in the future";
        document.getElementById("updateDate").style.visibility= "hidden";
    }
}

/******************************************************************************************
This function is called on click of the update date button. It then confirms the intention
of the user if they wish to make a change in the start date. If so, it get the route object,
changes the startDate value and calls the function overrideRouteDetails() to save it to
local storage.
******************************************************************************************/
function editStartDate()
{
    let userChoice = confirm("Are you sure that you wish to edit the start date of the route?")
    if (userChoice)
    {
        let newStartDate = document.getElementById("editStartDate").value;
        let routeName = document.getElementById("routeToLoad").value;
        let routeToEdit = new Route(routeName);
        routeToEdit._findRouteObject(routeName); // gets the route object
        routeToEdit._setStartDate(newStartDate);
        overrideRouteDetails(routeToEdit);
        alert("Start date has been changed! Reloading the page");
        location.reload();
    }
}

/******************************************************************************************
This function takes a route object, searches the local storage value with the "routeList" key
for the corresponding route object and changes the start date of it. It then saves it back
to local storage.

Inputs:
- An route object
Returns:
- Overrides the original route in local storage
******************************************************************************************/
function overrideRouteDetails(aRoute)
{
    let routeListPDO = JSON.parse(localStorage.getItem("routeList"));
    let currentRouteList = new RouteList();
    currentRouteList._initialiseFromRouteListPDO(routeListPDO);
    let routes = currentRouteList.getRouteList();
    for (let i =0; i < routes.length; i++) 
    {
        if (routes[i].getRouteName() == aRoute.getRouteName()) 
        {
            routes[i]._setStartDate(aRoute.getStartDate());
        }
    }
    currentRouteList._setRouteList(routes);
    let updatedRouteList = JSON.stringify(currentRouteList);
    localStorage.setItem("routeList", updatedRouteList);
}


/******************************************************************************************
This function is called on click of the delete route button. It then confirms the intention
of the user if they wish to delete the route. If so, it get the route object, checks if the
route has already begun, and deletes it from local storage if it has not. It also makes a 
function call to changeShipStatus to change the ship's status in local storage.

Otherwise it will alert the user that the route has already begun and cannot be deleted.
changes the startDate value and calls the function overrideRouteDetails() to save it to
local storage.
******************************************************************************************/
function deleteRoute()
{
    let userChoice= confirm("Are you sure that you wish to delete the current route?")
    if (userChoice)
    {
        let routeName = document.getElementById("routeToLoad").value;
        let foundRoute = new Route(routeName);
        foundRoute._findRouteObject(routeName);
        let routeListPDO = JSON.parse(localStorage.getItem("routeList"));
        let loadedRouteList = new RouteList();
        loadedRouteList._initialiseFromRouteListPDO(routeListPDO);
        let routes = loadedRouteList.getRouteList();
        for (let i =0; i < routes.length; i++) 
        {
            if (routes[i].getRouteName() == routeName) 
            {
                let today = new Date();
                let dateToCheck = new Date ((routes[i].getStartDate()).slice(0,4), (routes[i].getStartDate()).slice(5,7) -1, (routes[i].getStartDate()).slice(8));
                if (today > dateToCheck)
                {
                    alert("Unable to delete route as the ship is already enroute");
                }
                else
                {
                    routes.splice(i,1);
                    loadedRouteList._setRouteList(routes);
                    let updatedRouteList = JSON.stringify(loadedRouteList);
                    localStorage.setItem("routeList", updatedRouteList);
                    changeShipStatus(foundRoute.getShip().getShipName(), "available");
                    alert("Route Deleted! Reloading Page");
                    location.reload();
                }
            }
        }
    }
}

/******************************************************************************************
This function takes in a shipname and a string representing the status that is to be updated.
It takes the key value pair from local storage with the key of "shipList", and finds the ship
object with the same name as what was specified. It then changes that status of that ship
to what was passed into the function ("available"). It then stringifys the data and
sets it back into local storage
******************************************************************************************/
function changeShipStatus(shipName, status)
{
    let shipListJSON =JSON.parse(localStorage.getItem("shipList"));
    let currentShipList = new ShipList();
    currentShipList._initialiseFromShipListPDO(shipListJSON);
    let ships = currentShipList.getShipList();
    for (let i =0; i < ships.length; i++) 
    {
        if (ships[i].getShipName() == shipName) 
        {
            ships[i]._setStatus(status);
        }
    }
    currentShipList._setShipList(ships);
    let updatedShipsJSON = JSON.stringify(currentShipList);
    localStorage.setItem("shipList", updatedShipsJSON);
}