const dbPromised = idb.open("football stat", 1, (upgradeDb) => {
  const teamObjStore = upgradeDb.createObjectStore("favorite-teams", {
    keyPath: "id"
  });
  const playerObjStore = upgradeDb.createObjectStore("favorite-players", {
    keyPath: "id"
  });
  teamObjStore.createIndex("tla", "tla", {
    unique: false
  });
  playerObjStore.createIndex("name", "name", {
    unique: false
  });
});

const addDbTeam = (team) => {
  dbPromised.then((db) => {
    const trx = db.transaction("favorite-teams", "readwrite");
    const store = trx.objectStore("favorite-teams");
    console.log("dB add team, data: ", team);
    store.add(team);
    return trx.complete;
  }).then(() => {
    console.log("favorite team saved!");
    M.toast({
      html: "Added to favorite!"
    });
  });
};

const addDbPlayer = (player) => {
  dbPromised.then((db) => {
    const trx = db.transaction("favorite-players", "readwrite");
    const store = trx.objectStore("favorite-players");
    console.log("dB add player, data: ", player);
    store.add(player);
    return trx.complete;
  }).then(() => {
    console.log("favorite player saved!");
    M.toast({
      html: "Added to favorite!"
    });
  });
};

const delDbTeamById = (teamId) => {
  dbPromised.then((db) => {
    const trx = db.transaction("favorite-teams", "readwrite");
    const store = trx.objectStore("favorite-teams");
    store.delete(teamId);
    return trx.complete;
  }).then(() => {
    console.log("team deleted, id:", teamId);
    M.toast({
      html: "Team removed from favorite."
    });
  }).catch((error) => {
    console.error(error);
  });
};

const delDbPlayerById = (playerId) => {
  dbPromised.then((db) => {
    const trx = db.transaction("favorite-players", "readwrite");
    const store = trx.objectStore("favorite-players");
    store.delete(playerId);
    return trx.complete;
  }).then(() => {
    console.log("player deleted, id: ", playerId);
  }).catch((error) => {
    M.toast({
      html: "Player removed from favorite."
    });
    console.error(error);
  });
};

const getAllDbTeams = () => {
  return new Promise((resolve, reject) => {
    dbPromised.then((db) => {
      const trx = db.transaction("favorite-teams", "readonly");
      const store = trx.objectStore("favorite-teams");
      return store.getAll();
    }).then((teams) => {
      resolve(teams);
    });
  });
};

const getAllDbPlayers = () => {
  return new Promise((resolve, reject) => {
    dbPromised.then((db) => {
      const trx = db.transaction("favorite-players", "readonly");
      const store = trx.objectStore("favorite-players");
      return store.getAll();
    }).then((players) => {
      resolve(players);
    });
  });
};

const getDbTeamById = (teamId) => {
  return new Promise((resolve, reject) => {
    dbPromised.then((db) => {
      const trx = db.transaction("favorite-teams", "readonly");
      const store = trx.objectStore("favorite-teams");
      return store.get(teamId);
    }).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    });
  });
};

const getDbPlayerById = (playerId) => {
  return new Promise((resolve, reject) => {
    dbPromised.then((db) => {
      const trx = db.transaction("favorite-players", "readonly");
      const store = trx.objectStore("favorite-players");
      return store.get(playerId);
    }).then((player) => {
      resolve(player);
    }).catch((error) => {
      reject(error);
    });
  });
};