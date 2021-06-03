exports.EXIT_ALL = 0;
exports.EXIT = 1;
exports.SIGNUP = 2;
exports.SIGNIN = 3;
exports.SHOW_ALL = 4;
exports.ADD_PLAYER = 5;
exports.REMOVE_PLAYER = 6;
exports.ADD_TEAM = 7;
exports.REMOVE_TEAM = 8;
exports.ADD_TO_TEAM = 9;
exports.REMOVE_FROM_TEAM = 10;
exports.LIST_TEAMS = 11;
exports.LIST_TEAM_SQUAD = 12;

exports.parseRequest = rawRequest => {
    const num = +rawRequest;
    return (num === NaN || num < 0 || num > 12) ? null : num;
}



