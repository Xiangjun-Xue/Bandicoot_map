/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the createShip.html file
*/

var shipStatRef = document.getElementById("statusOfShip");

/******************************************************************************************
This function is called on page load. It first does a preliminary check if local storage
is available on the device and send an alert to notify the user if it is not.
Otherwise it checks if the key "shipList" exists wthin local storage and if not, it makes 
an API call to get the information and stores it into local storage.

Inputs:
- None
Returns:
- Alerts the user if local storage is not available
******************************************************************************************/
function setUp()
{
    if (typeof(Storage) !== "undefined")
    {
        // if statement checks if a ship list exists within the local storage and makes an API call if it does not
        if (localStorage.getItem("shipList") === null)
        {
            //API call to get list of ships 
            var shipURL = "https://eng1003.monash/api/v1/ships/?callback=getInfoFromShipAPI"
            var shipScript = document.createElement('script');
            shipScript.src = shipURL;
            document.body.appendChild(shipScript);
        }
    }
    else
    {
        alert("Please change to a different device your current device does not support local storage. Thank you!")    ;    
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
This function is called when the create ship button is pressed. It gets the user entered
data and checks if the speed, range and cost is an integer or float value before saving them
to a new ship instance and calling the saveShip() function to push it into local storage.

Inputs:
- Values obtained from the user entered text fields
Returns:
- Creats a ship object and saves it to local storage
******************************************************************************************/
function createShip()
{    
    let nameRef = document.getElementById("shipName").value;
    let velocity = document.getElementById("maxSpeed").value;
    if (checkIfFloat(velocity))
    {
        velocity = parseFloat(velocity);
    }
    else 
    {
        velocity = parseInt(velocity);
    }
    let limits = document.getElementById("shipRange").value;
    if (checkIfFloat(limits))
    {
        limits = parseFloat(limits);
    }
    else 
    {
        limits = parseInt(limits);
    }
    let fees = document.getElementById("costPerKM").value;
    if (checkIfFloat(fees))
    {
        fees = parseFloat(fees);
    }
    else 
    {
        fees = parseInt(fees);
    }
    let descRef = document.getElementById("shipDescription").value;
    let tempShip = new Ship (nameRef); 
    tempShip._setMaxSpeed(velocity);
    tempShip._setRange(limits);
    tempShip._setDesc(descRef);
    tempShip._setCost(fees);
    shipStatRef.innerHTML = "available";   
    saveShip(tempShip);
    alert("Ship Created Successfully! Redirecting to Index Page")
    window.location.href = "index.html";
}

/******************************************************************************************
This function takes a string and determines if it contains a float or int by checking if
the symbol "." exists within the string.

Inputs:
- A string
Returns:
- Returns true if it is a float, false if not
******************************************************************************************/
function checkIfFloat(string)
{
    // float
    if (string.indexOf(".") !== -1)
    {
        return true;
    }
    // int
    else
    {
        return false;
    }
}

/******************************************************************************************
This function takes a ship object and appends it to the current shipList that exists
in local storage with the "shipList" key. 

Inputs:
- A ship object
Returns:
- Saves it to local storage
******************************************************************************************/
function saveShip(aShip)
{
    let shipListJSON = JSON.parse(localStorage.getItem("shipList"));
    let currentShipList = new ShipList();
    currentShipList._initialiseFromShipListPDO(shipListJSON);
    currentShipList.addShip(aShip);
    updatedShipJSON = JSON.stringify(currentShipList);
    localStorage.setItem("shipList", updatedShipJSON);
}

/******************************************************************************************
This is an auxiliary error prevention function that checks if all fields have been entered 
in by the user and enables the create ship button if so. Otherwise it keeps it disabled.
******************************************************************************************/
function checkIfAllEntered()
{  
    if (document.getElementById('shipName').value != "" && document.getElementById('shipDescription').value!= "")
    {
        if (document.getElementById('shipRange').value != "" && document.getElementById('costPerKM').value!= "" && document.getElementById('maxSpeed').value!= "")
        {
            // Last check checks if the range, cost and speed are numbers or not
            if (!isNaN(document.getElementById("shipRange").value) && !isNaN(document.getElementById("costPerKM").value) && !isNaN(document.getElementById("maxSpeed").value))
            {
                document.getElementById('addShipButton').disabled = false;
                document.getElementById('guidingText').style.visibility = "hidden";
            }
            else
            {
                document.getElementById('guidingText').style.visibility = "visible";
                document.getElementById('addShipButton').disabled = true;
            }  
        }
        else 
        { 
            document.getElementById('guidingText').style.visibility = "visible";
            document.getElementById('addShipButton').disabled = true;
        }
                  
    }
    else
    {
        document.getElementById('guidingText').style.visibility = "visible";
        document.getElementById('addShipButton').disabled = true;
    }   
}

/******************************************************************************************
This is an auxiliary error prevention function that checks if a value passed into it is
a number or a string. It then checks if it is a positive number. It overrides the textfields
with the appropriate error messages to alert the user that their input is invalid.
This is used for the validation of the speed, range and cost.
******************************************************************************************/
function checkIfNumber(valueToCheck)
{
    value = valueToCheck.value;
    if (!isNaN(value))
    {
        if (Math.sign(parseInt(value)) === -1 || Math.sign(parseInt(value) === 0))
        {
            valueToCheck.value = "Number must be > 0";
        }
        else
        {
            checkIfAllEntered();
            return true
        }
    }
    else
    {
        valueToCheck.value = "Please enter a number!"; 
    }
    return false
}

/******************************************************************************************
This is an auxiliary function that works together with the checkIfNumber() function. It
removes the error messages that the checkIfNumber() function outputs to the textfields
on user click such that the user can work with a blank field again instead of deleting the
error messages themselves.
******************************************************************************************/
function eraseText(element)
{
    if (element.value === "Please enter a number!" || element.value === "Number must be > 0")
    {
       element.value = "";
    }
}


