/*
    Authors: Bertrand Wee (ID:30727987), Xiangjun Xue (ID:30472326), Jim Paul (ID:30151945)
    Class: MCD 4290 Engineering Mobile Applications
    Tutor: Mehran Vahid

    Week 11
    Date: 20/07/2020
    
    Description:
    Assignment 2- Ship Us Safe App
    MCD 4290, Trimester 2, 2020
    This javascript file is tied to the createPort.html file
*/

var countrySelectionRef = document.getElementById("countrySelect");
// List of all countries in the world as taken from https://www.codeinwp.com/snippets/list-of-all-countries-html-select-javascript-and-json-format/
// This helps restricts the user to only selecting valid countries as compared to typing out a field
const countryList = [
    "Afghanistan",
    "Aland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas ",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros ",
    "Congo (the Democratic Republic of the)",
    "Congo ",
    "Cook Islands ",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curacao",
    "Cyprus",
    "Czechia",
    "Cote d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic ",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands  [Malvinas]",
    "Faroe Islands ",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories ",
    "Gabon",
    "Gambia ",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See ",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic ",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands ",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands ",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger ",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands ",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines ",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation ",
    "Rwanda",
    "Reunion",
    "Saint Barthelemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan ",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan (Province of China)",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands ",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates ",
    "United Kingdom of Great Britain and Northern Ireland ",
    "United States Minor Outlying Islands ",
    "United States of America ",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];

/******************************************************************************************
This function is called on page load. It first does a preliminary check if local storage
is available on the device and send an alert to notify the user if it is not.
Otherwise it checks if the key "portList" exists wthin local storage and if not, it makes 
an API call to grab the port list and stores it into local storage.

It also populates the country select options with values from the array countryList.

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
        if (localStorage.getItem("portList") === null)
        {
            //API call to get list of ports 
            var portURL = "https://eng1003.monash/api/v1/ports/?callback=getInfoFromPortAPI";
            var portScript = document.createElement('script');
            portScript.src = portURL;
            document.body.appendChild(portScript);
        }
    }
    else
    {
        alert("Please change to a different device your current device does not support local storage. Thank you!")        
    }
    //for loop populates the country selection menu with a list of countries
    for (let i =0; i<countryList.length; i++)
    {
        let tempString = countryList[i];
        let element = document.createElement("option");
        element.textContent = tempString;
        element.value = tempString;
        countrySelectionRef.appendChild(element);
    }
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
This is an auxiliary error prevention function that checks if all fields have been entered 
in by the user and enables the create port button if so. Otherwise it keeps it disabled.
******************************************************************************************/
function checkAllEntered()
{
    if (document.getElementById('toSearch').value !== "" && document.getElementById('typePort').value !== "" && document.getElementById('sizePort').value !== "")
    {
        if (document.getElementById('countrySelect').value !== ""&& document.getElementById('locationPrec').value !== "")
        {
            document.getElementById('createPortButton').disabled = false;
        }
    }
    else
    {
        document.getElementById('createPortButton').disabled = true;
    }
}

// function that is called when the create port button is pressed. It makes a request to opencage API with a name to search up
// and gets the first result's latitude and longitude. This is forward geocoding.
/******************************************************************************************
This function is called when the create port button is pressed. It makes an API request to
opencage with a string value to search for. This is what the user enters in the 
"search for a place" field. This is forward geocoding.
******************************************************************************************/
function createPort()
{
    document.getElementById('createPortButton').disabled = true; // disables the button such that they are unable to press it twice by accident
    var baseURLOpenCage="https://api.opencagedata.com/geocode/v1/json";
    let stringToSearchFor = document.getElementById("toSearch").value;
    let openCageAPIKey = "a57bccd8137a47b88b27dd863bd8011f";
    
    let openCageData = {
        q:stringToSearchFor,
        key:openCageAPIKey,
        language:"en",
        pretty:"1",
        no_annotations:1,
        callback:"openCageResponse"
    };
    
    // Make the request
    jsonpRequest(baseURLOpenCage, openCageData);
}

/******************************************************************************************
This code simplifies the process of creating a full URL for the opencage API request. 
The function structure is adapted from MCD 4290 practical lab class 9.
******************************************************************************************/
function jsonpRequest(url, data)
{
    let fields = "";
    // For each key in data object...
    for (let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            if (fields.length == 0)
            {
                fields += "?";
            }
            else
            {
                fields += "&";
            }
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);
            fields += encodedKey + "=" + encodedValue;
         }
    }
    let script = document.createElement('script');
    script.src = url + fields;
    document.body.appendChild(script);
}

/******************************************************************************************
This function is the callback funtion to the API call made in the function createPort().
It first creates a port object and assigns the name, country, type, size and location
precision to the values entered in by the user.

It then takes the response data from opencage, gets the latitude and longitude of the 
first result and assigns it to the port object. If there are no results returned, it will
display an alert to the user to ask them to search for another term.
******************************************************************************************/
function openCageResponse(response)
{
    let tempPort = new Port (document.getElementById("toSearch").value);
    tempPort._setCountry(document.getElementById("countrySelect").value);
    tempPort._setType(document.getElementById("typePort").value);
    tempPort._setSize(document.getElementById("sizePort").value);
    tempPort._setLocPrecision(document.getElementById("locationPrec").value);
    if (response.results.length === 0)
    {
        alert("Oops! There were 0 results from your search entry. Try searching for something else.");
        document.getElementById('createPortButton').disabled = false;
        return false;
    }
    let latLngCoord = response.results[0].geometry; //gets the first result's lat and long
    tempPort._setLat(latLngCoord["lat"]);
    tempPort._setLng(latLngCoord["lng"]);
    savePort(tempPort);
    alert("The port has been saved! Redirecting you to the Index Page.");
    window.location.href = "index.html";
}

/******************************************************************************************
This function takes a port object and appends it to the current portList that exists
in local storage with the "portList" key. 

Inputs:
- A port object
Returns:
- Saves it to local storage
******************************************************************************************/
function savePort(aPort)
{
    let portListPDO = JSON.parse(localStorage.getItem("portList"));
    let currentPortList = new PortList();
    currentPortList._initialiseFromPortListPDO(portListPDO);
    currentPortList.addPort(aPort);
    updatedPortJSON = JSON.stringify(currentPortList);
    localStorage.setItem("portList", updatedPortJSON);
}
