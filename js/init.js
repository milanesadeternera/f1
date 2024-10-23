/*https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md
*/
const BASE_URL = "https://api.jolpi.ca";
let CURRENT_ROUND = "";
let CURRENT_SEASON = "2024";
let SEASON_CACHE = {};
const COUNTRY={
    "British" : "gb",
    "Austrian": "at",
    "Italian": "it",
    "German": "de",
    "American": "us",
    "French": "fr",
    "Swiss": "ch",
    "Dutch": "nl",
    "Monegasque": "mc",
    "Spanish": "es",
    "Mexican": "mx",
    "Canadian":"ca",
    "Japanese": "jp",
    "Thai": "th",
    "Australian":"au",
    "Danish":"dk",
    "Argentinian":"ar",
    "New Zealander":"nz",
    "Chinese": "cn",
    "Finnish": "fi",
    "USA": "US",
    "Singapore": "SG",
    "Azerbaijan": "AZ",
    "Italy": "IT",
    "Netherlands": "NL",
    "Belgium": "BE",
    "Hungary": "HU",
    "UK": "GB",
    "Austria": "AT",
    "Spain": "ES",
    "Canada": "CA",
    "Monaco": "MC",
    "China": "CN",
    "Japan": "JP",
    "Australia": "AU",
    "Saudi Arabia": "SA",
    "Bahrain": "BH",
    "Mexico": "MX",
    "Brazil": "BR",
    "United States": "US",
    "Qatar": "QA",
    "UAE": "AE",
};
document.addEventListener("DOMContentLoaded",()=>{

})

//showSpinner
function showSpinner(){
    document.getElementById("spinner").style.display="";
}
//hideSpinner
function hideSpinner(){
    document.getElementById("spinner").style.display="none";
}
//
function getFlag(country){
    if(COUNTRY[country] == undefined){
        console.log("no flag:",country);
    }else{
    let code = COUNTRY[country].toUpperCase();
    return `https://flagsapi.com/${code}/flat/64.png`;
    }
}

let getJsonData = async function (url){
    let result = {};
    return await fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw Error(response.statusText);
        }
    })
    .then(function(response){
        result.status = "ok";
        result.data = response;
        return result;
    })
    .catch(function(error){
        result.status = 'error';
        result.data = error;
        return result;
    })
}

//Drive Standings
async function driveStandings(year = new Date().getFullYear()){
    const DRIVE_STANDINGS=`/ergast/f1/${year}/driverstandings/`;

    let data = await getJsonData(BASE_URL+DRIVE_STANDINGS);
    if(data.status != "ok"){
        //error en la request
        console.log("error")
    }
    let table = data.data.MRData.StandingsTable.StandingsLists[0];
    CURRENT_ROUND=data.data.MRData.StandingsTable.round;
    CURRENT_SEASON=data.data.MRData.StandingsTable.season;
    return table;
}
//Constructor Standings
async function constructorStandings(year = new Date().getFullYear()){
    const CONSTRUCTOR_STANDINGS=`/ergast/f1/${year}/constructorstandings/`;

    let data = await getJsonData(BASE_URL+CONSTRUCTOR_STANDINGS);
    if(data.status != "ok"){
        //error en la request
        console.log("error")
    }
    let table = data.data.MRData.StandingsTable.StandingsLists[0];
    return table;
}

//Resultados de carrera
async function seasonResult(season){
    console.log("seasonResult:", season);
    let result = [];
    let end = false;
    let round = 1;

    if(SEASON_CACHE[season] == undefined){
        while(!end){
            let RACE_RESULT = `/ergast/f1/${season}/${round}/results/`;
            let json = await getJsonData(BASE_URL+RACE_RESULT);

            if(json.data.MRData.total != "0"){
                result.push(json.data.MRData.RaceTable.Races[0]);
                round ++;
            }else{
                //no hay resultados en la query
                end = true;
            }
        }
        //guardo en cache
        SEASON_CACHE[season] = result;
        return result;
    }else{
        //Tengo en caché la tabla.
        console.log("seasonResult: return cache");
        return SEASON_CACHE[season];
    }
}

//Calendario
async function getCalendar(){
    console.log("getCalendar:")
    let json = await getJsonData(BASE_URL+`/ergast/f1/current/`);
    return json.data.MRData.RaceTable.Races
}