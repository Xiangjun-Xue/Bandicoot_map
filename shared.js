/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file holds the code declarations and definitions for all of the classes.
*/

// Route class
class Route {
    constructor(name)
    {
        this.name = name;
        this._ship = "";
        this._sourcePort = "";
        this._destinationPort = "";
        this._distance = 0;
        this._time = 0;
        this._cost = 0;
        this._startDate = "";
        this._wayPointList = [];
    }
    //public methods
    getRouteName()
    {
        return this.name;
    }
    getShip()
    {
        return this._ship;
    }
    getSourcePort()
    {
        return this._sourcePort;
    }
    getDestinationPort()
    {
        return this._destinationPort;
    }
    getDistance()
    {
        return this._distance;
    }
    getTime()
    {
        return this._time;
    }
    getCost()
    {
        return this._cost;
    }
    getStartDate()
    {
        return this._startDate;
    }
    getWayPointList()
    {
        return this._wayPointList;
    }

    // private methods
    _setShip(ship)
    {
        this._ship = ship;
    }
    _setSourcePort(port)
    {
        this._sourcePort = port;
    }
    _setDestinationPort(port)
    {
        this._destinationPort = port;
    }
    _setDistance(dist)
    {
        this._distance = dist;
    }
    _setTime(time)
    {
        this._time = time;
    }
    _setCost(cost)
    {
        this._cost = cost;
    }
    _setStartDate(date)
    {
        this._startDate = date;
    }
    _setWayPointList(list)
    {
        this._wayPointList = list;
    }

    // Function that reinitialises the current instance from a public-data card object
    _initialiseFromRoutePDO(routePDO)
    {
        let tempShip = new Ship(routePDO._ship.name); //creates a ship object to store
        tempShip._initialiseFromShipPDO(routePDO._ship);
        this._ship = tempShip;
        let sourcePort = new Port(routePDO._sourcePort.name); //creates a port object to store
        sourcePort._initialiseFromPortPDO(routePDO._sourcePort);
        this._sourcePort = sourcePort;
        let destinationPort = new Port(routePDO._destinationPort.name); //creates a port object to store
        destinationPort._initialiseFromPortPDO(routePDO._destinationPort);
        this._destinationPort = destinationPort;
        this._startDate = routePDO._startDate;
        this._cost = routePDO._cost;
        this._distance = routePDO._distance;
        this._time= routePDO._time;
        this._wayPointList = routePDO._wayPointList;
    }

    /******************************************************************************************
    Function that takes a string representing the name of a route, gets the corresponding route
    from the routeList in local storage and returns the route object.
    ******************************************************************************************/
   _findRouteObject(routeName) 
   {
       let routeListJSON =JSON.parse(localStorage.getItem("routeList"));
       let currentRouteList = new RouteList();
       currentRouteList._initialiseFromRouteListPDO(routeListJSON);
       for (const route of currentRouteList._listOfRoutes) 
       {
           if (route.name == routeName) 
           {
               this.name = route.name;
               let tempShip = new Ship(route._ship.name);
               tempShip._initialiseFromShipPDO(route._ship);
               this._ship = tempShip;
               let sourcePort = new Port(route._sourcePort.name);
               sourcePort._initialiseFromPortPDO(route._sourcePort);
               this._sourcePort = sourcePort;
               let _destinationPort = new Port(route._destinationPort.name);
               _destinationPort._initialiseFromPortPDO(route._destinationPort);
               this._destinationPort = _destinationPort;
               this._distance = route._distance;
               this._time = route._time;
               this._cost = route._cost;
               this._startDate = route._startDate;
               this._wayPointList = route._wayPointList;
           }
       }
   }
}

// Ship class
class Ship{
    constructor(name)
    {
        this.name = name;
        this._maxSpeed = 0;
        this._range = 0;
        this._desc = "";
        this._cost = 0;
        this._status = "available";
    }
    //public methods
    getShipName()
    {
        return this.name;
    }
    getMaxSpeed()
    {
        return this._maxSpeed;
    }
    getRange()
    {
        return this._range;
    }
    getDescription()
    {
        return this._desc;
    }
    getCost()
    {
        return this._cost;
    }
    getStatus()
    {
        return this._status;
    }

    // private methods
    _setMaxSpeed(speed)
    {
        this._maxSpeed = speed;
    }
    _setRange(range)
    {
        this._range = range;
    }
    _setDesc(desc)
    {
        this._desc = desc;
    }
    _setCost(cost)
    {
        this._cost = cost;
    }
    _setStatus(status)
    {
        this._status = status;
    }

    // Function that reinitialises the current instance from a public-data card object that was obtained from the API call
    _initialiseFromShipPDOAPI(shipPDO)
    {
        this._maxSpeed = shipPDO.maxSpeed;
        this._range = shipPDO.range;
        this._desc =  shipPDO.desc;
        this._cost = shipPDO.cost
        this._status = shipPDO.status
    }
    // Function that reinitialises the current instance from a public-data card object
    _initialiseFromShipPDO(shipPDO)
    {
        this._maxSpeed = shipPDO._maxSpeed;
        this._range = shipPDO._range;
        this._desc =  shipPDO._desc;
        this._cost = shipPDO._cost
        this._status = shipPDO._status
    }

    /******************************************************************************************
    Function that takes a string representing the name of a ship, gets the corresponding ship
    from the shipList in local storage and returns the ship object.
    ******************************************************************************************/
    _findShipObject(shipName) 
    {
        let shipsJSON =JSON.parse(localStorage.getItem("shipList"));
        let currentShipList = new ShipList();
        currentShipList._initialiseFromShipListPDO(shipsJSON);
        for (const ship of currentShipList._listOfShips) 
        {
            if (ship.name == shipName) 
            {   
                this.name = ship.name;
                this._maxSpeed = ship._maxSpeed;
                this._range = ship._range;
                this._desc = ship._desc;
                this._cost = ship._cost;
                this._status = ship._status;
            }
        }
    }      
}


// Port class
class Port{
    constructor(name){
        this.name= name;
        this._country= "";
        this._type= "";
        this._size= "";
        this._locPrecision = ""
        this._lat = 0;
        this._lng = 0;
    }
    //public methods
    getPortName()
    {
        return this.name;
    }
    getCountry()
    {
        return this._country;
    }
    getType()
    {
        return this._type;
    }
    getSize()
    {
        return this._size;
    }
    getLocPrecision()
    {
        return this._locPrecision
    }
    getLat()
    {
        return this._lat;
    }
    getLng()
    {
        return this._lng;
    }

    //private methods
    _setCountry(country)
    {
        this._country = country;
    }
    _setType(type)
    {
        this._type = type;
    }
    _setSize(size)
    {
        this._size = size;
    }
    _setLocPrecision(locP)
    {
        this._locPrecision = locP;
    }
    _setLat(lat)
    {
        this._lat = lat;
    }
    _setLng(lng)
    {
        this._lng = lng;
    }
    // Function that reinitialises the current instance from a public-data card object that was obtained from the API call
    _initialiseFromPortPDOAPI(portPDO)
    {
        this._country = portPDO.country;
        this._type = portPDO.type;
        this._size = portPDO.size;
        this._locPrecision = portPDO.locprecision;
        this._lat = portPDO.lat;
        this._lng = portPDO.lng;
    }
    // Function that reinitialises the current instance from a public-data card object
    _initialiseFromPortPDO(portPDO)
    {
        this._country = portPDO._country;
        this._type = portPDO._type;
        this._size = portPDO._size;
        this._locPrecision = portPDO._locPrecision;
        this._lat = portPDO._lat;
        this._lng = portPDO._lng;
    }
    
    /******************************************************************************************
    Function that takes a string representing the name of a port, gets the corresponding port
    from the portList in local storage and returns the port object.
    ******************************************************************************************/
    _findPortObject(portName) 
    {
        let portsJSON =JSON.parse(localStorage.getItem("portList"));
        let currentPortList = new PortList();
        currentPortList._initialiseFromPortListPDO(portsJSON);
        for (const port of currentPortList._listOfPorts)
        {
            if (port.name == portName)
            {
                this.name = port.name;
                this._country = port._country;
                this._type = port._type;
                this._size = port._size;
                this._locPrecision = port._locPrecision;
                this._lat = port._lat;
                this._lng = port._lng;
            }
        }
    }
}

// RouteList class
class RouteList {
    constructor(){
        this._listOfRoutes = [];
    }

    //public methods
    addRoute(aRoute)
    {
        this._listOfRoutes.push(aRoute);
    }
    getRouteList()
    {
        return this._listOfRoutes;
    }

    //private methods
    _setRouteList(listOfRoutes)
    {
        this._listOfRoutes = listOfRoutes;
    }
    // function that initialises and returns a routeList object from a parsed JSON file
    _initialiseFromRouteListPDO(routeListPDO)
    {
        for (let i = 0; i < routeListPDO._listOfRoutes.length; i++)
        {
            let newRoute = new Route(routeListPDO._listOfRoutes[i].name);
            newRoute._initialiseFromRoutePDO(routeListPDO._listOfRoutes[i]);
            this._listOfRoutes[i] = newRoute;
        }
    }
}

// ShipList class
class ShipList{
    constructor()
    {
        this._listOfShips = [];
    }

    //public methods
    addShip(aShip)
    {
        this._listOfShips.push(aShip);
    }
    getShipList()
    {
        return this._listOfShips;
    }

    //private methods
    _setShipList(listOfShips)
    {
        this._listOfShips = listOfShips;
    }
    // function that initialises and returns a routeList object from a parsed JSON file
    _initialiseFromShipListPDOAPI(shipListPDO)
    {
        for (let i = 0; i < shipListPDO.ships.length; i++)
        {
            let newShip = new Ship(shipListPDO.ships[i].name);
            newShip._initialiseFromShipPDOAPI(shipListPDO.ships[i]);
            this._listOfShips[i] = newShip;
        }
    }
    // function that initialises and returns a routeList object from a parsed JSON file
    _initialiseFromShipListPDO(shipListPDO)
    {
        for (let i = 0; i < shipListPDO._listOfShips.length; i++)
        {
            let newShip = new Ship(shipListPDO._listOfShips[i].name);
            newShip._initialiseFromShipPDO(shipListPDO._listOfShips[i]);
            this._listOfShips[i] = newShip;
        }
    }
}

// PortList class
class PortList{
    constructor()
    {
        this._listOfPorts = [];
    }

    //public methods
    addPort(aPort)
    {
        this._listOfPorts.push(aPort);
    }
    getPortList()
    {
        return this._listOfPorts;
    }

    //private methods
    _setPortList(listOfPorts)
    {
        this._listOfPorts = listOfPorts;
    }
    _initialiseFromPortListPDOAPI(portPDO)
    {
        for (let i = 0; i < portPDO.ports.length; i++)
        {
            let newPort = new Port(portPDO.ports[i].name);
            newPort._initialiseFromPortPDOAPI(portPDO.ports[i]);
            this._listOfPorts[i] = newPort;
        }
    }
    _initialiseFromPortListPDO(portPDO)
    {
        for (let i = 0; i < portPDO._listOfPorts.length; i++)
        {
            let newPort = new Port(portPDO._listOfPorts[i].name);
            newPort._initialiseFromPortPDO(portPDO._listOfPorts[i]);
            this._listOfPorts[i] = newPort;
        }
    }
}




