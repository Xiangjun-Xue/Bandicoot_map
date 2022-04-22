/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the index.html file
*/

/******************************************************************************************
This function is called on page load. It checks if local storage is available on the device 
and send an alert to notify the user if it is not.
If it is, it then makes a function call to getRoutes() to display all the routes as cards.
******************************************************************************************/
function setUp()
{
    if (typeof(Storage) !== "undefined")
    {
      getRoutes()
    }
    else
    {
      alert("Please change to a different device your current device does not support local storage. Thank you!")        
    }
}

/******************************************************************************************
This function does a check if the key "routeList" exists within local storage. If it does not
it alerts the user that there are no routes currently saved.

Otherwise it gets the value from local storage, and initializes a routeList object from it.
It then creates divisions which contain mdl formatted cards that hold the information about
a route and outputs it to the html page. It creates as many cards as there are routes.
The cards all have a more information segment which can be pressed to view more detailed
information about the route.
******************************************************************************************/
function getRoutes()
{
    if (localStorage.getItem("routeList") !== null )
    {
        let routeListPDO = JSON.parse(localStorage.getItem("routeList"));
        let currentRouteList = new RouteList();
        currentRouteList._initialiseFromRouteListPDO(routeListPDO);
        let routes = currentRouteList.getRouteList();

        const outputContainer = document.getElementById("outputArea");

        // creates a div for each route present in the list of routes
        for (let i = 0; i < routes.length; i++)
        {
            const card = document.createElement("div");
            const info = `
                <div class="demo-card-square mdl-card mdl-shadow--2dp" id= "displayCard" style="margin:3px">
                <div class="mdl-card__title mdl-card--expand" >
                <h2 class="mdl-card__title-text" id = "routeNameDisplay">${routes[i].getRouteName()} </h2>
                </div>
                <button type="button" class="collapsible" >More information</button>
                <div class= "content">
                    <div class="mdl-card__supporting-text">
                    <!--Ship-->
                    <span id="routeShip" style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Ship: ${routes[i].getShip().getShipName()}</span>

                    <!--Start Date-->
                    <span id="routeStartDate" style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Start Date: ${routes[i].getStartDate()}</span>
                    
                    <!--Starting Port-->
                    <span id= "routeStartPort" style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Origin Port: ${routes[i].getSourcePort().getPortName()}</span>

                    <!--Destination Port-->
                    <span id= "routeEndPort"style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Destination Port: ${routes[i].getDestinationPort().getPortName()}</span>

                    <!--Travel Time-->
                    <span id="routeDuration" style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Total Duration: ${routes[i].getTime()} days</span>

                    <!--Cost-->
                    <span id= "routeCost" style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Total Cost: ${routes[i].getCost()} units</span>

                    <!--Distance-->
                    <span id= "routeDistance"style="display: inline-block; width: 285px; border-bottom: 1px solid lightgrey; margin-bottom:9px;">Total Distance: ${routes[i].getDistance()} km</span>
                    </div>
                </div>
                </div>
                `;
                outputContainer.innerHTML += info;
        }
    }
    // alerts the user with a notification if there is no routes stored in local storage.
    else
    {
        alert("Oops! No routes currently exist");
    }
    // code to attach event listeners to each of the buttons created alongside the route cards that will display more information upon click
    var buttons = document.getElementsByClassName("collapsible");
    for (let i = 0; i <buttons.length; i++)
    {
      buttons[i].addEventListener("click", function() {

        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block")
        {
          content.style.display = "none";
        }
        else
        {
          content.style.display = "block";
        }
      });
    }
}


