/*
Estas funciones SOLO crean el contenido a mostrar en la página.
El manejo del contenido se hace en controller.js
*/


//tabla pilotos
function driverStandingsContent(data){
    console.log("driverStandingsContent",data);
    //creo tabla ol
    let olElement = document.createElement('ol');
    olElement.setAttribute('class', 'list-group list-group-numbered');
    olElement.setAttribute('data-bs-theme', 'dark');

    //agrego elementos
    data.DriverStandings.forEach(driver => {
        let flag = getFlag(driver.Driver.nationality);
        content = 
        `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-start pointer" onclick=driverDetailController("${driver.Driver.driverId}")>
            <div class="ms-2 me-auto">
                <div class="fw-bold">
                    ${driver.Driver.familyName}
                </div>
                ${driver.Constructors[0].name}
            </div>
            <div class="me-2">
                ${driver.Driver.permanentNumber ?? ""}
                <img src="${flag}" class="nation">
            </div>
            <div class="d-flex flex-column col-2">
            <span class="badge text-bg-primary rounded-pill mb-1">Puntos: ${driver.points}</span>`;
            if(driver.wins > 0){
                content += `<span class="badge text-bg-success rounded-pill">Victorias: ${driver.wins}</span>`;
            }

        content +=`</div>
        </li>`;
        hideSpinner();
        olElement.insertAdjacentHTML('beforeend', content);
    });
    return olElement;
}

//tabla constructores
function constructorStandingsContent(data){
    console.log("constructorStandingsContent():",data);
    //creo tabla ol
    let olElement = document.createElement('ol');
    olElement.setAttribute('class', 'list-group list-group-numbered');
    olElement.setAttribute('data-bs-theme', 'dark');

    //agrego elementos
    data.ConstructorStandings.forEach(team => {
        content = 
        `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${team.Constructor.name}</div>
                ${team.Constructor.nationality}
                </div>
                <div class="d-flex flex-column col-2">
                <span class="badge text-bg-primary rounded-pill mb-1">Puntos: ${team.points}</span>
                <span class="badge text-bg-success rounded-pill">Victorias: ${team.wins}</span>
                </div>
        </li>`;
        hideSpinner();
        olElement.insertAdjacentHTML('beforeend', content);
    });
    return olElement;
}

//Resultados del piloto en la temporada.
async function driverDetailContent(season, driver){
    console.log("driverDetailContent():",season, driver, ROUND);
    //Creo div que contiente respuesta entera.
    let div = document.createElement('div');

    let driverId = driver.driverId;

    //creo cabecera
    let ulHeadElement = document.createElement('ul');
    ulHeadElement.setAttribute('class', 'list-group mb-3');
    ulHeadElement.setAttribute('data-bs-theme', 'dark');
    div.appendChild(ulHeadElement);

    let flag = getFlag(driver.nationality);
    let headContent = `
        <div class="me-auto">
        <button type="button" class="btn" onclick=changeTab("nav-pilotos-tab")><img src="data/arrow-left.svg"> volver</button>
        </div>
        <li class="list-group-item">
            <div class="d-flex  mx-2">
                <p class="fw-bold my-auto fs-4 align-middle">${driver.givenName} ${driver.familyName}</p>
                <p class="fw-lignt ms-2 my-auto"> #${driver.permanentNumber}</p>
            </div>
            <div class="d-flex">
                <img src="${flag}" class="nation ms-2">
                <p class="fw-bold mx-2 my-auto align-middle">${driver.nationality}</p>
                <p class="fw-light my-auto align-middle"></p>
            </div>
        </li>
    `;

    ulHeadElement.insertAdjacentHTML('afterbegin', headContent);

    //creo tabla ul
    let ulElement = document.createElement('ul');
    ulElement.setAttribute('class', 'list-group');
    ulElement.setAttribute('data-bs-theme', 'dark');
    div.appendChild(ulElement);

    season.forEach( round => {
        let driverStats = round.Results.filter(result => result.Driver.driverId == driverId)[0];
        //Si tengo undefined, el piloto no corrió
        if(driverStats != undefined){
            let flag = getFlag(round.Circuit.Location.country);
            content = 
            `<li class="list-group-item justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="d-flex">
                        <p>#${round.round}</p>
                        <img src="${flag}" class="nation ms-2">
                        <p class="fw-bold mx-2">${round.raceName}</p>
                        <p>${round.Circuit.circuitName}</p>
                    </div>
                </div>
                <div class="ms-2 me-auto d-flex justify-content-between align-items-start">
                    <div class="text-start w-25">
                        <p class="mb-0 fs-5 text-decoration-underline">Largada</p>
                        <p class="mb-0 fs-4">${driverStats.grid}</p>`;
                        if(driverStats.grid == 1){
                            content += `<span class="badge text-bg-warning rounded-pill">Pole</span>`;
                        }

                    content +=`
                    </div>
                    <div class="text-end w-25">
                        <p class="mb-0 fs-5 text-decoration-underline">Llegada</p>`;
                        //DNF
                        if(driverStats.positionText != "R"){
                            content +=`
                            <p class="mb-0 fs-4">${driverStats.position}</p>
                            <p class="mb-0 fs-6">${driverStats.Time?.time ?? driverStats.status}</p>`;
                        }else{
                            content +=`
                            <span class="badge text-bg-danger rounded-pill">DNF</span>`;
                        }
                content += `
                    </div>
                    <div class="text-end w-25">
                        <p class="mb-0 fs-5 text-decoration-underline">Fast Lap</p>`;
                        if((driverStats.FastestLap?.rank ?? "0") == "1"){
                            content+=`
                            <p class="mb-1 fs-4">
                            <span class="badge fastlap rounded-pill">
                            ${driverStats.FastestLap?.Time?.time ?? "no data"}
                            </span></p>`;
                        }else{
                            content+=`<p class="mb-0 fs-4">${driverStats.FastestLap?.Time?.time ?? "no data"}</p>`;
                        }
                content +=`    
                        <p class="mb-0 fs-6">Lap: ${driverStats.FastestLap?.lap ?? "no data"}</p>
                    </div>
                    <div class="text-end w-25">
                        <p class="mb-0 fs-5 text-decoration-underline">Puntos</p>
                        <p class="mb-0 fs-4">${driverStats.points}</p>
                        <p></p>
                    </div>
                </div>
            </li>`;
            ulElement.insertAdjacentHTML('beforeend', content);
        }
    })
    return div;
}

//Tabla calendario
async function calendarContent(data){
    console.log("calendarContent():",data);
    //creo tabla ul
    let ulElement = document.createElement('ul');
    ulElement.setAttribute('class', 'list-group');
    ulElement.setAttribute('data-bs-theme', 'dark');

    data.forEach(round => {
        let flag = getFlag(round.Circuit.Location.country);
        content = 
            `<li class="list-group-item list-group-item-action justify-content-between align-items-start pointer" onclick="roundDetailController(${round.round})">
                <div class="ms-2 me-auto">
                    <div class="d-flex align-items-center">
                        <p class="my-auto">#${round.round}</p>
                        <img src="${flag}" class="nation ms-2">
                        <p class="fw-bold mx-2 my-auto fs-4 align-middle">${round.raceName}</p>
                        <p class="fw-light my-auto align-middle">${round.Circuit.circuitName}</p>`;
                if((round.Sprint?.date ?? "") != ""){
                        content += `<span class="badge text-bg-warning ms-auto">SPRINT</span>`;
                }
            content += `
                    </div>
                </div>
                <div class="d-flex">
                    <p>Fecha: ${round.date}</p>`;
            //Proxima Fecha
            if(round.round == parseInt(ROUND)+1){
                content +=`
                            <span class="badge text-bg-success ms-auto">
                                <p class="fs-6 my-1" >Proxima
                                <img src="data/calendar-check.svg" ></p>
                            </span>
                        `;
            }

        content +=`
                    </div>
                </div>
            </li>`;
        ulElement.insertAdjacentHTML('beforeend', content);   
    })
    return ulElement;
}

//Tabla resultado de una ronda
async function roundDetailContent(season, roundId, sprint){
    console.log("roundDetailContent():", roundId);

    //Recupero datos.
    let round = season.filter( race => parseInt(race.round) == roundId)[0];

    //No se corrio la carrera
    if(round == undefined){
        console.log("roundDetailContent(): no encontre la carrera");
        return false;
    }
    //Creo div que contiente respuesta entera.
    let div = document.createElement('div');

    //creo cabecera
    let ulHeadElement = document.createElement('ul');
    ulHeadElement.setAttribute('class', 'list-group mb-3');
    ulHeadElement.setAttribute('data-bs-theme', 'dark');
    div.appendChild(ulHeadElement);
    let flag = getFlag(round.Circuit.Location.country);
    let headContent = `
        <div class="me-auto">
        <button type="button" class="btn" onclick=changeTab("nav-calendar-tab")><img src="data/arrow-left.svg"> volver</button>
        </div>
        <li class="list-group-item">
            <div>
                <p class="my-auto">Round: ${round.round}</p>
            </div>
            <div class="d-flex">
                <img src="${flag}" class="nation ms-2">
                <p class="fw-bold mx-2 my-auto fs-4 align-middle">${round.raceName}</p>
                <p class="fw-light my-auto align-middle">${round.Circuit.circuitName}</p>
            </div>
        </li>
    `;

    ulHeadElement.insertAdjacentHTML('afterbegin', headContent);

    //creo tabla ul
    let ulElement = document.createElement('ul');
    ulElement.setAttribute('class', 'list-group');
    ulElement.setAttribute('data-bs-theme', 'dark');

    //tiene sprint?
    console.log("roundDetailContent(): Sprint", sprint);
    if(sprint != false){
        //hay sprint
        //================================================
        //si estas viendo esto, perdon. se puede optimizar
        //================================================
        //tabElement
        //tableDiv
        //  ->divRace
        //      -> ulElement
        //  ->divSprint
        //      -> ul ELementSptint
        //Creo cabecera
        let tabElement = document.createElement('ul');
        tabElement.setAttribute('class', 'nav nav-tabs');
        tabElement.setAttribute('data-bs-theme', 'dark');
        tabElement.innerHTML = `
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="race-tab" data-bs-toggle="tab" data-bs-target="#race-tab-pane" type="button" role="tab" aria-controls="race-tab-pane" aria-selected="true">Race</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="sprint-tab" data-bs-toggle="tab" data-bs-target="#sprint-tab-pane" type="button" role="tab" aria-controls="sprint-tab-pane" aria-selected="false">Sprint</button>
            </li>
        `;
        div.appendChild(tabElement);

        //creo cuerpo de contenido
        let tableDiv = document.createElement('div');
        tableDiv.setAttribute("class", "tab-content");
        div.appendChild(tableDiv);

        //Race
        let divRace = document.createElement('div');
        divRace.setAttribute("class", "tab-pane fade show active");
        divRace.setAttribute("id", "race-tab-pane")
        tableDiv.appendChild(divRace);
        divRace.appendChild(ulElement);

        //Sprint
        let divSprint = document.createElement('div');
        divSprint.setAttribute("class", "tab-pane fade");
        divSprint.setAttribute("id", "sprint-tab-pane");
        tableDiv.appendChild(divSprint);


        //creo tabla ul Sprint
        let ulElementSprint = document.createElement('ul');
        ulElementSprint.setAttribute('class', 'list-group');
        ulElementSprint.setAttribute('data-bs-theme', 'dark');
        divSprint.appendChild(ulElementSprint);

        ulElementSprint.insertAdjacentHTML('beforeend', tableSprint(sprint, ulElementSprint));

    }else{
        //no hay sprint
        div.appendChild(ulElement);
    }

    content =`<li class="list-group-item">
                <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Pos.</th>
                    <th scope="col">Piloto</th>
                    <th scope="col">Equipo</th>
                    <th scope="col">Tiempo</th>
                    <th scope="col" class="text-end">Puntos</th>
                    </tr>
                </thead>
                <tbody>`;

    round.Results.forEach( result => {
        //Lista Resultados
        content +=`
                    <tr>
                        <th scope="row">${result.position}</th>
                        <td>${result.Driver.familyName}</td>
                        <td>${result.Constructor.name}</td>`;

                        //DNF
                        if(/^[a-zA-Z]$/.test(result.positionText)){
                            content += `<td><span class="badge text-bg-danger rounded-pill">DNF</span></td>`;
                        }else{
                            content += `<td>${result.Time?.time ?? result.status}</td>`
                        }
                        //Fast Lap
                        if((result.FastestLap?.rank ?? "0") == "1"){
                            content +=`<td class="text-end">
                                    <span class="badge fastlap rounded-pill me-2">Fast Lap</span>
                                    ${result.points}
                                    </td>`;
                        }else{
                            content +=`<td class="text-end">${result.points}</td>`;
                        }
                        
                    content +=`</tr>`;
    })
    content +=`</tbody></table></li>`;
    ulElement.insertAdjacentHTML('beforeend', content);
    return div;
}

//Esta funcion arma la tabla sprint.
function tableSprint(sprint, ulElement){
    console.log("tableSprint()", sprint);
    let content =`<li class="list-group-item">
    <table class="table">
    <thead>
        <tr>
        <th scope="col">Pos.</th>
        <th scope="col">Piloto</th>
        <th scope="col">Equipo</th>
        <th scope="col">Tiempo</th>
        <th scope="col" class="text-end">Puntos</th>
        </tr>
    </thead>
    <tbody>`;
    sprint.forEach( result => {
        //Lista Resultados
        content +=`
                    <tr>
                        <th scope="row">${result.position}</th>
                        <td>${result.Driver.familyName}</td>
                        <td>${result.Constructor.name}</td>`;

                        //DNF
                        if(/^[a-zA-Z]$/.test(result.positionText)){
                            content += `<td><span class="badge text-bg-danger rounded-pill">DNF</span></td>`;
                        }else{
                            content += `<td>${result.Time?.time ?? result.status}</td>`
                        }
                        //Fast Lap
                        if((result.FastestLap?.rank ?? "0") == "1"){
                            content +=`<td class="text-end">
                                    <span class="badge fastlap rounded-pill me-2">Fast Lap</span>
                                    ${result.points}
                                    </td>`;
                        }else{
                            content +=`<td class="text-end">${result.points}</td>`;
                        }
                        
                    content +=`</tr>`;
    })
    content +=`</tbody></table></li>`;
    ulElement.insertAdjacentHTML('beforeend', content);
}