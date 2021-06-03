exports.AuthPrinter = class AuthPrinter {
    constructor() {}

    invitePromo() {
        console.log("Введите промокод (оставьте поле пустым, если нет): ");
    }

    invitePassword() {
        console.log("Введите пароль: ");
    }

    inviteLogin() {
        console.log("Введите логин: ");
    }
}
