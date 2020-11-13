const BASE_URL = "https://api.football-data.org/v2/";
const AUTH_TOKEN = "bdac7ccfa8414762aacf0c2f039def4a";

const responseStatus = (response) => {
  if (response.status !== 200) {
    console.log("error: ", response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
};

const convertJson = (response) => {
  return response.json();
};

const errorHandler = (error) => {
  console.error("error: ", error);
};

const renderStandings = (data) => {
  let standingsHTML = "";
  let isGroupStage = false;
  let teamGroup = "";
  document.querySelector(".competition-name").innerHTML = data.competition.name;

  data.standings.forEach(standing => {
    if (standing.stage === "GROUP_STAGE") {
      isGroupStage = true;
      teamGroup = standing.group.substr(6);
    }
    standing.table.forEach(team => {
      standingsHTML += `
        <tr>
          <td class="team-group">${teamGroup}</td>
          <td>${team.position}</td>
          <td>
            <a href="./team.html?id=${team.team.id}" class="valign-wrapper" >
              <img src="${team.team.crestUrl}" alt="${team.team.name} crest" class="circle responsive-img">
              <h6 class="hide-on-med-and-down">${team.team.name}</h6>
            </a>
          </td>
          <td>${team.playedGames}</td>
          <td>${team.won}</td>
          <td>${team.draw}</td>
          <td>${team.lost}</td>
          <td>${team.goalDifference}</td>
          <td>${team.points}</td>
        </tr>
      `;
    });
    document.getElementById("standings-content").innerHTML = standingsHTML;
    document.querySelectorAll(".team-group").forEach((elm) => {
      if (isGroupStage) {
        elm.classList.remove("hide");
      } else {
        elm.classList.add("hide");
      }
    });
    if (isGroupStage) {
      document.querySelector(".group-thead").classList.remove("hide");
    } else {
      document.querySelector(".group-thead").classList.add("hide");
    }
  });
};

const renderTeams = (data) => {
  let teamsHTML = "";
  document.querySelector(".competition-name").innerHTML = data.competition.name;
  data.teams.forEach(team => {
    let teamCrest = team.crestUrl;

    if (teamCrest === null || teamCrest === "") {
      teamCrest = "/assets/img/helper.png";
    }
    teamsHTML += `
      <div class="col s6 m3 l2">
        <div class="card">
          <a href="./team.html?id=${team.id}">
            <div class="center-align waves-effect waves-block waves-light">
              <img src="${teamCrest}" alt="${team.name} crest" class="responsive-img">
              <h6 class="truncate">${team.name}</h6>
            </div>
          </a>
        </div>
      </div>
    `;
  });
  document.getElementById("team-list").innerHTML = teamsHTML;
};

const renderTeamProfil = (data) => {
  const teamLogoElm = document.querySelector("img.team-logo");
  const teamNameElm = document.querySelector(".team-name");
  const teamAreaElm = document.querySelector(".team-area");
  const teamShortNameElm = document.querySelector(".team-short-name");
  const teamAddressElm = document.querySelector(".team-address");
  const teamPhoneElm = document.querySelector(".team-phone");
  const teamWebsiteElm = document.querySelector(".team-website");
  const teamEmailElm = document.querySelector(".team-email");
  const teamFoundedElm = document.querySelector(".team-founded");
  const teamColorsElm = document.querySelector(".team-colors");
  const teamVenueElm = document.querySelector(".team-venue");
  const teamSquadElm = document.getElementById("team-squad");

  let teamVenue = data.venue;
  if (teamVenue === null) {
    teamVenue = "-";
  }

  teamLogoElm.setAttribute("src", data.crestUrl);
  teamLogoElm.setAttribute("alt", `${data.name} crest`);
  teamNameElm.innerHTML = data.name;
  teamAreaElm.innerHTML = data.area.name;
  teamShortNameElm.innerHTML = data.shortName;
  teamAddressElm.innerHTML = data.address;
  teamPhoneElm.innerHTML = data.phone;
  teamWebsiteElm.innerHTML = `<a href="${data.website}" target="blank">${data.website}</a>`;
  teamEmailElm.innerHTML = data.email;
  teamFoundedElm.innerHTML = data.founded;
  teamColorsElm.innerHTML = data.clubColors;
  teamVenueElm.innerHTML = teamVenue;

  let teamSquad = "";
  data.squad.forEach(player => {
    let playerPosition = player.position;
    if (playerPosition === null) {
      playerPosition = "-";
    }

    teamSquad += `
      <div class="collection-item avatar">
        <i class="material-icons circle">person</i>
        <a href = "./player.html?id=${player.id}">
          <span class="title">${player.name}</span>
        </a>
        <p>Position: ${playerPosition}</p>
        <a href="./player.html?id=${player.id}" class="secondary-content">
          <i class="material-icons">navigate_next</i>
        </a>
      </div>
    `;
  });
  teamSquadElm.innerHTML = teamSquad;
};

const renderPlayerProfil = (data) => {
  const playerNameElm = document.querySelector(".player-name");
  const playerFirstNameElm = document.querySelector(".player-firstname");
  const playerLastNameElm = document.querySelector(".player-lastname");
  const playerDobElm = document.querySelector(".player-dob");
  const playerPobElm = document.querySelector(".player-pob");
  const playerNationElm = document.querySelector(".player-nationality");
  const playerPositionElm = document.querySelector(".player-position");
  const playerNumberElm = document.querySelector(".player-number");

  let playerLastName = data.lastName;
  let playerNumber = data.shirtNumber;

  if (playerLastName === null) {
    playerLastName = "";
  }
  if (playerNumber === null) {
    playerNumber = "";
  }

  playerNameElm.innerHTML = data.name;
  playerFirstNameElm.innerHTML = data.firstName;
  playerLastNameElm.innerHTML = playerLastName;
  playerDobElm.innerHTML = data.dateOfBirth;
  playerPobElm.innerHTML = data.countryOfBirth;
  playerNationElm.innerHTML = data.nationality;
  playerPositionElm.innerHTML = data.position;
  playerNumberElm.innerHTML = playerNumber;
};

const getStandings = (competitionId) => {
  if ("caches" in window) {
    caches.match(BASE_URL + "competitions/" + competitionId + "/standings?standingType=TOTAL")
      .then((response) => {
        if (response) {
          response.json().then(renderStandings);
        }
      });
  }

  fetch(BASE_URL + "competitions/" + competitionId + "/standings?standingType=TOTAL", {
      headers: {
        "X-Auth-Token": AUTH_TOKEN
      }
    })
    .then(responseStatus)
    .then(convertJson)
    .then((data) => {
      renderStandings(data);
    }).catch(errorHandler);
};

const getTeams = (competitionId) => {
  if ("caches" in window) {
    caches.match(BASE_URL + "competitions/" + competitionId + "/teams").then((response) => {
      if (response) {
        response.json().then(renderTeams);
      }
    });
  }

  fetch(BASE_URL + "competitions/" + competitionId + "/teams", {
      method: "GET",
      headers: {
        "X-Auth-Token": AUTH_TOKEN
      }
    }).then(responseStatus)
    .then(convertJson)
    .then((data) => {
      renderTeams(data);
    }).catch(errorHandler);
};

const getTeamById = () => {
  return new Promise((resolve, reject) => {
    const urlParam = new URLSearchParams(window.location.search);
    const idParam = urlParam.get("id");

    if ("caches" in window) {
      caches.match(BASE_URL + "teams/" + idParam).then((response) => {
        if (response) {
          response.json().then((data) => {
            renderTeamProfil(data);
            resolve(data);
          });
        }
      });
    }

    fetch(BASE_URL + "teams/" + idParam, {
        method: "GET",
        headers: {
          "X-Auth-Token": AUTH_TOKEN
        }
      }).then(responseStatus)
      .then(convertJson)
      .then((data) => {
        renderTeamProfil(data);
        resolve(data);
      }).catch((error) => {
        errorHandler(error);
        reject(error);
      });
  });
};

const getPlayerById = () => {
  return new Promise((resolve, reject) => {
    const urlParam = new URLSearchParams(window.location.search);
    const idParam = urlParam.get("id");

    if ("caches" in window) {
      caches.match(BASE_URL + "players/" + idParam).then((response) => {
        if (response) {
          response.json().then((data) => {
            renderPlayerProfil(data);
            resolve(data);
          });
        }
      });
    }

    fetch(BASE_URL + "players/" + idParam, {
        method: "GET",
        headers: {
          "X-Auth-Token": AUTH_TOKEN
        }
      }).then(responseStatus)
      .then(convertJson)
      .then((data) => {
        renderPlayerProfil(data);
        resolve(data);
      }).catch((error) => {
        errorHandler(error);
        reject(error);
      });
  });
};

const getFavItems = () => {
  getAllDbTeams().then((teams) => {
    let favTeamsHTML = "";
    teams.forEach(team => {
      favTeamsHTML += `
        <div class="collection-item avatar valign-wrapper">
          <img src="${team.crestUrl}" alt="${team.name} crest" class="circle">
          <a href="./team.html?id=${team.id}&fav=true&tag=team" class="waves-effect waves-block waves-light">
            <span class="title truncate">${team.name}</span>
          </a>
          <div data-id="${team.id}" class="fav-btn secondary-content waves-effect waves-block waves-light">
            <i class="material-icons red-text">favorite</i>
          </div>
        </div>
      `;
    });
    const favTeamsParent = document.getElementById("fav-teams");
    favTeamsParent.innerHTML = favTeamsHTML;
    document.querySelectorAll("#fav-teams .fav-btn").forEach(btn => {
      const teamId = Number(btn.getAttribute("data-id"));
      const favTeamsChild = btn.parentNode;
      btn.addEventListener("click", (event) => {
        delDbTeamById(teamId);
        favTeamsParent.removeChild(favTeamsChild);
        console.log("fav team deleted, id: ", teamId);
      });
    });
  });

  getAllDbPlayers().then((players) => {
    let favPlayersHTML = "";
    players.forEach(player => {
      favPlayersHTML = `
        <div class="collection-item avatar valign-wrapper">
            <i class="material-icons circle">person</i>
          <div>
            <a href="./player.html?id=${player.id}&fav=true&tag=player" class="waves-effect waves-block waves-light">
              <span class="title collection-title">${player.name}</span>
            </a>
            <p class="collection-content">Position: ${player.position}</p>
          </div>
          <div data-id="${player.id}" class="fav-btn secondary-content waves-effect waves-block waves-light">
            <i class="material-icons collection-content-second red-text">favorite</i>
          </div>
        </div>
      `;
    });
    const favPlayerParent = document.getElementById("fav-players");
    favPlayerParent.innerHTML = favPlayersHTML;
    document.querySelectorAll("#fav-players .fav-btn").forEach(btn => {
      const playerId = Number(btn.getAttribute("data-id"));
      const favPlayerChild = btn.parentNode;
      btn.addEventListener("click", (event) => {
        delDbPlayerById(playerId);
        favPlayerParent.removeChild(favPlayerChild);
        console.log("fav player deleted, id: ", playerId);
      });
    });
  });
};

const getFavTeamById = () => {
  return new Promise((resolve, reject) => {
    const urlParam = new URLSearchParams(window.location.search);
    const idParam = Number(urlParam.get("id"));
    getDbTeamById(idParam).then((data) => {
      renderTeamProfil(data);
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
};

const getFavPlayerById = () => {
  return new Promise((resolve, reject) => {
    const urlParam = new URLSearchParams(window.location.search);
    const idParam = Number(urlParam.get("id"));
    getDbPlayerById(idParam).then((data) => {
      renderPlayerProfil(data);
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
};