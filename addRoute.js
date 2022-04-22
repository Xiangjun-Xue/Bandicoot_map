/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the addRoute.html file
*/


var distanceRef = document.getElementById("totalDistance");
var costRef = document.getElementById("tripCost");
var timeRef = document.getElementById("travelTime");
var wayPointsRef = document.getElementById("wayPoints");
var originPortRef = document.getElementById("originPort");
var destinationPortRef = document.getElementById("destinationPort");
var shipChoiceRef = document.getElementById("shipChoice");
var toastRef = document.getElementById("toast");

// Mapbox key
mapboxgl.accessToken = 'pk.eyJ1IjoiZGlzdGFyZXJpYSIsImEiOiJja2VnbmxpNmwweWdiMnpwcXlmYWQ0NjBsIn0.RRK0LyUztj4_h0q6jtpReA';

// Creates the map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    zoom: 8,
});

/******************************************************************************************
This function is called on page load. It first does a preliminary check if local storage
is available on the device and send an alert to notify the user if it is not.
Otherwise it checks if the keys "shipList" and "portList" exists within local storage and if not, 
it makes the respective API calls to grab the ship and port list and stores it into local storage.

It will also prompt the user to refresh the page if it is the first time using the application
as it needs to save the ship and port list into local storage.
Lastly it changes the text within the toast label to provide the user with instructions.

Inputs:
- None
Returns:
- Alerts the user if local storage is not available
******************************************************************************************/
function setUp()
{
    if (typeof(Storage) !== "undefined")
    {
        // if statement checks if a port list exists within the local storage and makes an API call if it does not
        if (localStorage.getItem("portList") !== null && localStorage.getItem("shipList") !== null)
        {
            let portJSON = JSON.parse(localStorage.getItem("portList"));
            processPorts(portJSON);
            toastRef.innerText = "Please start by entering the Route Name, Starting Date and Ports";
        }
        else
        { 
            if (localStorage.getItem("portList") === null ) 
            {
                var portURL = "https://eng1003.monash/api/v1/ports/?callback=getInfoFromPortAPI";
                var portScript = document.createElement('script');
                portScript.src = portURL;
                document.body.appendChild(portScript);
            }
            if (localStorage.getItem("shipList") === null)
            {
                //API call to populate the ship choices
                var shipURL = "https://eng1003.monash/api/v1/ships/?callback=getInfoFromShipAPI";
                var shipScript = document.createElement('script');
                shipScript.src = shipURL;
                document.body.appendChild(shipScript);
            }
            alert("Please refresh this page as it is your first time setting up the application!");
        }
    }
    else
    {
        alert("Please change to a different device your current device does not support local storage. Thank you!");      
    }
}

/******************************************************************************************
This function is the callback funtion to the API call made in the function setUp().
It is called by the API as a callback and saves a port list into local storage with
the key "shipList"
******************************************************************************************/
function getInfoFromShipAPI(ships)
{
    let listOfShips = new ShipList();
    listOfShips._initialiseFromShipListPDOAPI(ships);
    localStorage.setItem("shipList", JSON.stringify(listOfShips));
}

/******************************************************************************************
This function is the callback funtion to the API call made in the function setUp().
It is called by the API as a callback and saves a port list into local storage paired
with the key "portList".
******************************************************************************************/
function getInfoFromPortAPI(ports)
{
    let listOfPorts = new PortList();
    listOfPorts._initialiseFromPortListPDOAPI(ports);
    localStorage.setItem("portList", JSON.stringify(listOfPorts));
}

/******************************************************************************************
This function takes 4 float values as input which represent the latitudes and longitudes
of two different locations. It then performs mathematical formulas and returns the distance
between the two locations in kilometers. The formula was obtained from the following url: 
https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
******************************************************************************************/
function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


/******************************************************************************************
This function takes a shipList as a compulsory argument and a number as an optional argument.

It then gets the starting port and ending port coordinates, finds the distance between them
and determines the list of available ships which support that distance. If a number is passed in
as a optional argument, it uses that as the distance to check for instead.

It then creates an option element for each ship and appends it to the ship choices.
******************************************************************************************/
function processShips(shipList, km = 0)
{
    shipChoiceRef.innerText = ""; // resets the ship choices
    let blankPlaceHolder = document.createElement("option"); 
    blankPlaceHolder.textContent = "";
    blankPlaceHolder.value = "";
    shipChoiceRef.appendChild(blankPlaceHolder);
    let startingPortName = document.getElementById("originPort").value;
    let endingPortName = document.getElementById("destinationPort").value;
    //get starting port
    let startingPort = new Port();
    startingPort._findPortObject(startingPortName);
    let startingPortCoord = [startingPort.getLat(), startingPort.getLng()];
    //get ending port
    let endingPort = new Port();
    endingPort._findPortObject(endingPortName);
    let endingPortCoord = [endingPort.getLat(), endingPort.getLng()];
    //get distance between starting and ending port
    let distanceToCheck = distance(startingPortCoord[0], startingPortCoord[1], endingPortCoord[0],endingPortCoord[1]);
    distanceToCheck = distanceToCheck.toFixed();

    // if statment handles when a number (km) is passed into the function 
    if (km != 0)
    {
        let ships = shipList.getShipList();
        for (let i = 0; i < ships.length ; i++)
        {   
            if (ships[i].getRange() > km && ships[i].getStatus() == "available") 
            {
                let tempString = ships[i].getShipName();
                let eleS = document.createElement("option");
                eleS.textContent = tempString;
                eleS.value = tempString;
                shipChoiceRef.appendChild(eleS);
            }
        }
        // Checks if there are any no ships left to choose from as the distance is too far.
        if (shipChoiceRef.innerText == "")
        {
            toastRef.innerText = "Oops, there are no more ships which operate to such a distance! Existing Route has been Deleted. Please refresh the page and start over. ";
            document.getElementById("newShip").style.visibility= "hidden"; // disables the updateShip button
        }
    }
    // else branch handles when initially chosing from a list of ships for the initial route
    else
    {
        let ships = shipList.getShipList();
        for (let i = 0; i < ships.length ; i++)
        {   
            if (ships[i].getRange() > distanceToCheck && ships[i].getStatus() == "available")
            {
                let tempString = ships[i].getShipName();
                let eleS = document.createElement("option");
                eleS.textContent = tempString;
                eleS.value = tempString;
                shipChoiceRef.appendChild(eleS);
            }
        }
        // Checks if the initial distance is too far.
        if (shipChoiceRef.innerText == "")
        {
            toastRef.innerText = "Opps, there are no ships which operate to such a distance! Please create a new ship or change the ports.";
        }
    }
}

/******************************************************************************************
This function gets the value from local storage associated with the key "portList". It then 
directly reads the parsed JSON data and populates the starting and ending port choice options 
with the names of all the ports within the saved file for the user to choose from.
******************************************************************************************/
function processPorts()
{
    let portListJSON =JSON.parse(localStorage.getItem("portList"));
    let currentPortList = new PortList();
    currentPortList._initialiseFromPortListPDO(portListJSON);
    let ports = currentPortList.getPortList();
    for (let i = 0; i < ports.length; i++)
    {
        let tempString = ports[i].getPortName();
        let eleO = document.createElement("option");
        let eleD = document.createElement("option");
        eleO.textContent = tempString;
        eleO.value = tempString;
        eleD.textContent = tempString;
        eleD.value = tempString;
        originPortRef.appendChild(eleO);
        destinationPortRef.appendChild(eleD);
    }    
}

/******************************************************************************************
This function will check if the user has selected a start and end port, and if so, calls 
the processShips function to populate the ship choices and enables the ship selection function.
******************************************************************************************/
function checkPortsIfEntered()
{
    if (document.getElementById('originPort').value != "" && document.getElementById('destinationPort').value!= "")
    {
        document.getElementById('shipChoice').style.display = "block";
        toastRef.innerText = "Please select a Ship";
        let shipListJSON = JSON.parse(localStorage.getItem("shipList"));
        let currentShipList = new ShipList();
        currentShipList._initialiseFromShipListPDO(shipListJSON);
        processShips(currentShipList);
    }
}

/******************************************************************************************
This is an auxiliary error prevention function that checks if all fields have been entered 
in by the user and enables the create initial route button if so. Otherwise it keeps it disabled.
This ensures that the route is always created with all the relavant information and does not
miss out anything.
******************************************************************************************/
function checkReady()
{
    if (document.getElementById('startDate').value != "" && document.getElementById('routeName').value!= "" && document.getElementById("shipChoice").value != "")
    {
        document.getElementById('initialRoute').disabled = false;
    }
    else
    {
        document.getElementById('initialRoute').disabled = true;
    }
}

/******************************************************************************************
This function is called when the user clicks the update ship button which updates the 
chosen ship and reenables the map for them to continue plotting their route.
******************************************************************************************/
function updateShip()
{
    toastRef.innerText = "Ship Updated Successfully!";
    document.getElementById("map").style.visibility= "visible"; //enables the map
    document.getElementById("newShip").style.visibility= "hidden"; // disables the updateShip button
}

/******************************************************************************************
Function that changes the status of a ship and updates the shipList in local storage once 
the route has been confirmed.
******************************************************************************************/
function changeShipStatus(shipName, status)
{
    let shipsJSON =JSON.parse(localStorage.getItem("shipList"));
    let currentShipList = new ShipList();
    currentShipList._initialiseFromShipListPDO(shipsJSON);
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

/******************************************************************************************
Function that gets the initial user entered values to create a temporary route instance 
that will be passed to and further modified in the createRoute function. It also creates the 
markers on the map for the starting and ending port.
******************************************************************************************/
function getInitialRoute()
{
    let routeName = document.getElementById("routeName").value;
    let shipChoice = document.getElementById("shipChoice").value;
    let startingPort = document.getElementById("originPort").value;
    let endingPort = document.getElementById("destinationPort").value;
    let startDate = document.getElementById("startDate").value;

    let initialRoute = new Route(routeName);
    initialRoute._setStartDate(startDate);
    let ship = new Ship(shipChoice);
    initialRoute._setShip(ship._findShipObject(shipChoice));
    let sPort = new Port(startingPort);
    sPort._findPortObject(startingPort);
    initialRoute._setSourcePort(sPort);
    let ePort = new Port(endingPort);
    ePort._findPortObject(endingPort);
    initialRoute._setDestinationPort(ePort);

    document.getElementById("map").style.visibility= "visible"; //enables the map
    document.getElementById("timeDiv").style.visibility = "visible";
    document.getElementById("costDiv").style.visibility = "visible";
    document.getElementById("distDiv").style.visibility = "visible";
    document.getElementById("initialRoute").style.visibility= "hidden";
    panToPort(sPort);
    var startingPortMarker = new mapboxgl.Marker({color: "#32CD32"}) //green color
    .setLngLat([initialRoute.getSourcePort().getLng(), initialRoute.getSourcePort().getLat()])
    .setPopup(new mapboxgl.Popup().setHTML("Port " + initialRoute.getSourcePort().getPortName()).addTo(map))
    .addTo(map)
    .togglePopup(); 
    var endingPortMarker = new mapboxgl.Marker({color: "#DC143C"}) //red color
      .setLngLat([initialRoute.getDestinationPort().getLng(), initialRoute.getDestinationPort().getLat()])
      .setPopup(new mapboxgl.Popup().setHTML("Port " + initialRoute.getDestinationPort().getPortName()).addTo(map))
      .addTo(map)
      .togglePopup();
    toastRef.innerText = "You may start clicking on the map to add waypoints in between your ports!";
    createRoute(initialRoute);
}

/******************************************************************************************
Function that handles the main functionality of the route creation. It takes in a half compelted 
route object that has a name, start date, ship, source and destination port. It then 
contains a map onclick function which will add waypoints to the map if it is less than 100km
from the previous waypoint. 

Once the last waypoint is placed within 100km form the destination port, the route will be 
completed and the user will be prompted if they want to save the route or not.
******************************************************************************************/
function createRoute(initialRoute)
{
    let referenceLat = initialRoute.getSourcePort().getLat();
    let referenceLng = initialRoute.getSourcePort().getLng();
    let lngLatList = [[referenceLng, referenceLat]];
    let totalDistance = 0;
    let estimatedTime = 0;
    let totalCost = 0;
    let currentDistToDestination = 0;
    let endPort = initialRoute.getDestinationPort();
    // following code will be executed whenever the user clicks on a spot on the map
    map.on('click', function(e) {
        let currentShip = new Ship();
        currentShip._findShipObject(document.getElementById("shipChoice").value);
        currentLocation = e.lngLat.wrap() //gets the current latitude and longitude based on the location clicked by the user
        currentDistToDestination = (distance(currentLocation['lat'], currentLocation['lng'], endPort.getLat(), endPort.getLng())).toFixed(2);
        distanceToWayPoint = (distance(currentLocation['lat'], currentLocation['lng'], referenceLat, referenceLng)).toFixed();
        // if statement checks if the location pressed by the user is more than 100km away from the previous waypoint
        if (distanceToWayPoint > 100)
        {
            toastRef.innerHTML = "Waypoint Successfully Added!";
            lngLatList.push([currentLocation['lng'], currentLocation['lat']]);
            referenceLat = currentLocation['lat'];
            referenceLng = currentLocation['lng'];
            var waypoint = new mapboxgl.Marker({color: "#FF8C00"})
                .setLngLat([currentLocation['lng'], currentLocation['lat']])
                .addTo(map)
                showPath(lngLatList) // draws a line to the new waypoint
            //update the parameters
            totalDistance += parseInt(distanceToWayPoint); //updates the total distance
            estimatedTime += parseFloat((totalDistance / (currentShip.getMaxSpeed() * 1.85))); // 1 knott = 1.85km
            totalCost += parseFloat((totalDistance * currentShip.getCost()).toFixed(2)); // updates the total cost
            distanceRef.innerText = totalDistance + " km" //displays the updates to the user
            costRef.innerText = totalCost + " units"; //displays the updates to the user 
            timeRef.innerText = estimatedTime.toFixed(2) + "hours" + " / " + (estimatedTime / 24).toFixed(2) + " Days"; //displays the updates to the user
            // If statement checks if the current total distance has exceeded the current ship's range
            if (totalDistance > currentShip.getRange())
            {
                document.getElementById('map').style.visibility= "hidden"; // removes the map and prevents the user from adding more points until they chose a new ship
                document.getElementById("newShip").style.visibility= "visible"; //enables the update ship button
                toastRef.innerText = "Current Route exceeds range of Ship! Please select a new ship and Press Update";
                document.getElementById("newShip").disabled = false;
                let shipListJSON = JSON.parse(localStorage.getItem("shipList"));
                let currentShipList = new ShipList();
                currentShipList._initialiseFromShipListPDO(shipListJSON);
                processShips(currentShipList, totalDistance);
            }
            // If statement checks if the last waypoint clicked is within 100km from the destination port. 
            if (parseInt(currentDistToDestination) < 100)
            {
                lngLatList.push([endPort.getLng(), endPort.getLat()]);
                showPath(lngLatList);
                userChoice= confirm("Route has been completed! There is less than 100km from your last waypoint to the Destination Port. Do you want to save this route?");
                if (userChoice)
                {
                    initialRoute._setShip(currentShip);
                    initialRoute.getShip()._setStatus("en-route");
                    initialRoute._setCost(totalCost.toFixed(2));
                    initialRoute._setDistance(totalDistance);
                    initialRoute._setTime((estimatedTime / 24).toFixed(2));
                    initialRoute._setWayPointList(lngLatList.slice(1, (lngLatList.length -1)));
                    saveRoute(initialRoute);
                    changeShipStatus(currentShip.getShipName(), "en-route") //changes the ship's status to en-route
                    toastRef.innerText = "Route Saved!";
                    alert("Route has been Saved! Redirecting you to the index page");
                    window.location.href = "index.html";
                }
                else
                {
                    alert("Route has canceled! Reloading the page")
                    toastRef.innerText = "Route Canceled!";
                    location.reload();
                }
            }
        }
        else
        {
            toastRef.innerText = "Waypoint needs to be at least 100km away from the previous point!  Distance of Selected Point from Previous Point: " + distanceToWayPoint + " km";
        }
    });
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
            removeLayerWithId('route')
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
This function takes a route object and appends it to the current routeList that exists
in local storage with the "routeList" key. If it does not exist, it will make and save a 
new routeList instead. 

Inputs:
- A route object
Returns:
- Appends it to the existing routeList in local storage or creates a new one if not present
******************************************************************************************/
function saveRoute(aRoute)
{
    if (localStorage.getItem("routeList") === null) 
    {
        let routeList = new RouteList ();
        routeList.addRoute(aRoute);
        routeJSON = JSON.stringify(routeList);
        localStorage.setItem("routeList", routeJSON);
    }
    else
    {
        let routeListPDO = JSON.parse(localStorage.getItem("routeList"));
        let currentRouteList = new RouteList();
        currentRouteList._initialiseFromRouteListPDO(routeListPDO);
        currentRouteList.addRoute(aRoute);
        updatedRouteListJSON = JSON.stringify(currentRouteList);
        localStorage.setItem("routeList", updatedRouteListJSON);
    }
}
