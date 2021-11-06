const defaultPlayer = {
    id: 1,
    fname: "Ivan",
    lname: "Ivanov",
    dob: "2000-01-01 12:12:12",
    cntry: "Russia"
};

module.exports.getPlayer = (_req, res, _next) => {
    console.log("getPlayer");
    res.status(200).send(JSON.stringify(defaultPlayer));
};

module.exports.modifyPlayer = (_req, res, _next) => {
    console.log("modifyPlayer");
    res.status(200).send("ok");
};

module.exports.deletePlayer = (_req, res, _next) => {
    console.log("deletePlayer");
    res.status(200).send("ok");
};

module.exports.getAllPlayers = (_req, res, _next) => {
    console.log("getAllPlayers");
    res.status(200).send(JSON.stringify([defaultPlayer, defaultPlayer]));
};

module.exports.postPlayer = (_req, res, _next) => {
    console.log("postPlayer");
    res.status(200).send("ok");
};
