/*https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md
*/
const BASE_URL = "https://api.jolpi.ca";
let ROUND = "";
let SEASON = "2024";
let SEASON_CACHE = {};
let CALENDAR_CACHE = {};
//CONST COUNTRY definida en country.js

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
async function driveStandings(){
    console.log("driveStandings()", SEASON);
    const DRIVE_STANDINGS=`/ergast/f1/${SEASON}/driverstandings/`;

    let data = await getJsonData(BASE_URL+DRIVE_STANDINGS);
    if(data.status != "ok"){
        //error en la request
        console.log("error")
    }
    let table = data.data.MRData.StandingsTable.StandingsLists[0];
    ROUND=data.data.MRData.StandingsTable.round;
    //SEASON=data.data.MRData.StandingsTable.season;
    return table;
}
//Constructor Standings
async function constructorStandings(){
    console.log("constructorStandings():", SEASON)
    const CONSTRUCTOR_STANDINGS=`/ergast/f1/${SEASON}/constructorstandings/`;

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
        SEASON_CACHE[season] = result.reverse();
        return SEASON_CACHE[season];
    }else{
        //Tengo en caché la tabla.
        console.log("seasonResult: return cache");
        return SEASON_CACHE[season];
    }
}

//Calendario
async function getCalendar(){
    console.log("getCalendar()", SEASON);
    let result = ""; 
    if(CALENDAR_CACHE[SEASON] == undefined){
        let json = await getJsonData(BASE_URL+`/ergast/f1/${SEASON}/`);
        result = json.data.MRData.RaceTable.Races
        //guardo en memoria.
        CALENDAR_CACHE[SEASON]=result;
    }else{
        console.log("getCalendar():", SEASON, " caché");
        result = CALENDAR_CACHE[SEASON];
    }

    return result;
}

//info piloto
async function getDriver(season, driverId){
    console.log("getDriver():", season, driverId)
    let json = await getJsonData(BASE_URL+`/ergast/f1/${season}/drivers/${driverId}/`);
    return json.data.MRData.DriverTable.Drivers[0];
}

//Obtener sprint
async function getSprint(roundId){
    console.log("getSprint():",SEASON,roundId);
    let calendar = await getCalendar();
    let round = calendar.filter(round => round.round == roundId)[0];
    if(round.Sprint !== undefined){
        //hay sprint
        let json = await getJsonData(BASE_URL+`/ergast/f1/${SEASON}/${roundId}/sprint/`);
        return json.data.MRData.RaceTable.Races[0].SprintResults;
    }else{
        return false;
    }
}