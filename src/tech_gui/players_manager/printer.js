exports.PlayersPrinter = class PlayersPrinter {
    constructor() {}

    printPlayer(player) {
        console.log(`${player.id}. ${player.fname} ${player.lname}, ${player.cntry} (${player.dob})`);
    }

    inviteDelId() {
        console.log("Введите ID игрока для удаления: ");
    }

    inviteFname() {
        console.log("Введите имя игрока: ");
    }

    inviteLname() {
        console.log("Введите фамилию игрока: ");
    }

    inviteCntry() {
        console.log("Введите страну игрока: ");
    }

    inviteDob() {
        console.log("Введите дату рождения игрока в формате (ГГГГ-ММ-ДД): ");
    }
}

