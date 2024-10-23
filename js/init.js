/*https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md
*/
const BASE_URL = "https://api.jolpi.ca";
let CURRENT_ROUND = "";
let CURRENT_SEASON = "2024";

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
    let code = COUNTRY[country].toUpperCase();
    return `https://flagsapi.com/${code}/flat/64.png`;
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
async function driverResult( season, round){
    let RACE_RESULT = `/ergast/f1/${season}/${round}/results/`;
    let json = await getJsonData(BASE_URL+RACE_RESULT);
    return json.data.MRData.RaceTable.Races[0];

    /*
    let results = {}
    //recorro cada carrera de la temporada
    for(i=CURRENT_ROUND ; i>18 ; i--){
        let raceResult = {};
        let DRIVER_RESULT = `/ergast/f1/${CURRENT_SEASON}/${i}/results/`;
        let json = await getJsonData(BASE_URL+DRIVER_RESULT);
        let data = json.data.MRData.RaceTable.Races[0];
        
        raceResult.round = data.round;
        raceResult.raceName = data.raceName;
        raceResult.date = data.date;

        let driverStats = data.Results.filter( pos => pos.Driver.driverId == driverId);
        console.log("Busque", driverId, driverStats);

        console.log(data);
        */

    
}