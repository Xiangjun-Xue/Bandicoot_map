/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the viewShip.html file
*/

var shipToLoadRef = document.getElementById("shipToLoad");
var titleCardRef = document.getElementById("titleCard");;
var shipSpeedRef = document.getElementById("shipSpeed");
var shipRangeRef = document.getElementById("shipRange");
var shipDescriptionRef = document.getElementById("shipDescription");
var shipCostRef = document.getElementById("shipCost");
var shipStatusRef = document.getElementById("shipStatus");
var userCreatedRef = document.getElementById("userCreated");
    
/******************************************************************************************
This function is called on page load. It first does a preliminary check if local storage
is available on the device and send an alert to notify the user if it is not.
Otherwise it checks if the key "shipList" exists wthin local storage and if not, it makes 
an API call to grab the ship list and stores it into local storage.

Lastly it calls the function getShipList() to populate the ship choices on the html page.

Inputs:
- None
Returns:
- Alerts the user if local storage is not available
******************************************************************************************/
function setUp()
{
    if (typeof(Storage) !== "undefined")
    {
        if (localStorage.getItem("shipList") === null )
        {
            var shipURL = "https://eng1003.monash/api/v1/ships/?callback=getInfoFromShipAPI";
            var shipScript = document.createElement('script');
            shipScript.src = shipURL;
            document.body.appendChild(shipScript);
            alert("Please refresh this page as it is your first time viewing the Ships!");
        }
        getShipList();
    }
    else
    {
        alert("Please change to a different device your current device does not support local storage. Thank you!");
        toastRef.innerText = "Application is not supported on your Device";
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
This function is called by the setup() function on page load. It gets the value from local storage
associated with the key "shipList". It then directly reads the parsed JSON data and populates
the ship choice options with the names of all the ships within the saved file for the user
to choose from.

Inputs:
- None
Returns:
- Populates the select class "shipToLoad" with many option elements representing ship names
******************************************************************************************/
function getShipList()
{
    let shipListJSON =JSON.parse(localStorage.getItem("shipList"));
    let currentShipList = new ShipList();
    currentShipList._initialiseFromShipListPDO(shipListJSON);
    let ships = currentShipList.getShipList();
    for (let i = 0; i < ships.length; i++)
    {
        let tempString = ships[i].getShipName();
        let element = document.createElement("option");
        element.textContent = tempString;
        element.value = tempString;
        shipToLoadRef.appendChild(element);
    }  
}

/******************************************************************************************
This function is called onchange of the ship selection. It take an element, which is the 
select class "shipToLoad", and sets the value as the ship name. It then makes a call to get
the ship object, and outputs the data onto the screen at the respective areas on the mdl card.
It also checks if the ship is from the API or created by the User.

Inputs:
- An element ("shipToLoad")
Returns:
- Displays the ship information on the screen
******************************************************************************************/
function findShip(element)
{
    document.getElementById("displayCard").style.visibility = "visible"; // shows the mdl card on screen
    let shipsName = element.value;
    let foundShip = new Ship(shipsName);
    foundShip._findShipObject(shipsName);

    // gets the list of ships and marks the first 13 ships as from API
    let shipListJSON =JSON.parse(localStorage.getItem("shipList"));
    let currentShipList = new ShipList();
    currentShipList._initialiseFromShipListPDO(shipListJSON);
    let ships = currentShipList.getShipList();
    let APIShips = ships.slice(0,13);
    let APIShipNames = []; // array to hold ship names
    for (const ship of APIShips)
    {   
        APIShipNames.push(ship.getShipName());
    }
    
    titleCardRef.innerHTML = foundShip.getShipName();
    shipSpeedRef.innerHTML = "Speed: " + foundShip.getMaxSpeed() + " knots";
    shipRangeRef.innerHTML = "Range: " + foundShip.getRange() + " km";
    shipDescriptionRef.innerHTML = "Description: " + foundShip.getDescription();
    shipCostRef.innerHTML = "Cost: " + foundShip.getCost() + " units/km";
    shipStatusRef.innerHTML = "Status: " + foundShip.getStatus();
    // checks if the ship is from the API or not
    if (APIShipNames.includes(foundShip.getShipName()))
    {
        userCreatedRef.innerHTML = "Ship Source: Ship From API"
    }
    else
    {
        userCreatedRef.innerHTML = "Ship Source: User Created Ship"
    }

}
