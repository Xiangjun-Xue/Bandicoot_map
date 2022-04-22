/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the viewPort.html file
*/

var portToLoadRef = document.getElementById("portToLoad");
var portNameDisplayRef = document.getElementById("portNameDisplay");
var countryRef = document.getElementById("country");
var typePortRef = document.getElementById("typePort");
var sizePortRef = document.getElementById("sizePort");
var latitudeRef = document.getElementById("latitude");
var longitudeRef = document.getElementById("longitude");
var userCreatedRef = document.getElementById("userCreated");

/******************************************************************************************
This function is called on page load. It first does a preliminary check if local storage
is available on the device and send an alert to notify the user if it is not.
Otherwise it checks if the key "portList" exists wthin local storage and if not, it makes 
an API call to grab the port list and stores it into local storage.

Lastly it calls the function getPortList() to populate the port choices on the html page.

Inputs:
- None
Returns:
- Alerts the user if local storage is not available
******************************************************************************************/
function setUp()
{
    if (typeof(Storage) !== "undefined")
    {
        if (localStorage.getItem("portList") == null )
        {
            var portURL = "https://eng1003.monash/api/v1/ports/?callback=getInfoFromPortAPI";
            var portScript = document.createElement('script');
            portScript.src = portURL;
            document.body.appendChild(portScript);
            alert("Please refresh this page as it is your first time viewing the Ports!");
        }
    }
    else
    {
        alert("Please change to a different device your current device does not support local storage. Thank you!")        
    }
    getPortList();
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
This function is called by the setup() function on page load. It gets the value from local storage
associated with the key "portList". It then directly reads the parsed JSON data and populates
the port choice options with the names of all the ports within the saved file for the user
to choose from.

Inputs:
- None
Returns:
- Populates the select class "portToLoad" with many option elements representing port names
******************************************************************************************/
function getPortList()
{
    let portListJSON =JSON.parse(localStorage.getItem("portList"));
    let currentPortList = new PortList();
    currentPortList._initialiseFromPortListPDO(portListJSON);
    let ports = currentPortList.getPortList();
    for (let i = 0; i < ports.length; i++)
    {
        let tempString = ports[i].getPortName();
        let element = document.createElement("option");
        element.textContent = tempString;
        element.value = tempString;
        portToLoadRef.appendChild(element);
    }    
}

/******************************************************************************************
This function is called onchange of the port selection. It take an element, which is the 
select class "portToLoad", and sets the value as the port name. It then makes a call to get
the port object, and outputs the data onto the screen at the respective areas on the mdl card.
It also checks if the port is from the API or user created.

Inputs:
- An element ("portToLoad")
Returns:
- Displays the port information on the screen
******************************************************************************************/
function findPort(element)
{
    document.getElementById("displayCard").style.visibility = "visible"; // shows the mdl card on screen
    let portName = element.value;
    let foundPort = new Port(portName);
    foundPort._findPortObject(portName);

    // gets the list of ports and marks the first 3557 as from API
    let PortListJSON =JSON.parse(localStorage.getItem("portList"));
    let currentPortList = new PortList();
    currentPortList._initialiseFromPortListPDO(PortListJSON);
    let ports = currentPortList.getPortList();
    let APIPorts = ports.slice(0,3556);
    let APIPortNames = []; // array to hold ship names
    for (const port of APIPorts)
    {   
        APIPortNames.push(port.getPortName());
    }

    portNameDisplayRef.innerHTML = foundPort.getPortName();
    countryRef.innerHTML ="Country: " +  foundPort.getCountry();
    typePortRef.innerHTML = "Type: " + foundPort.getType();
    sizePortRef.innerHTML = "Size: " + foundPort.getSize();
    latitudeRef.innerHTML = "Latitude: " + foundPort.getLat();
    longitudeRef.innerHTML = "Longitude: " + foundPort.getLng();
    // checks if the ship is from the API or not
    if (APIPortNames.includes(foundPort.getPortName()))
    {
        userCreated.innerHTML = "Port Source: Port From API"
    }
    else
    {
        userCreated.innerHTML = "Port Source: User Created Port"
    }
}