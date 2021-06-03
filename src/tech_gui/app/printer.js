const INVITE_MENU = "\
0.  Выйти из программы.\n\
1.  Выйти из системы.\n\
2.  Зарегистрироваться в системе.\n\
3.  Войти в систему.\n\
4.  Показать всех игроков.\n\
5.  Добавить игрока.\n\
6.  Удалить игрока.\n\
7.  Создать команду.\n\
8.  Удалить команду.\n\
9.  Добавить игрока в команду.\n\
10. Удалить игрока из команды.\n\
11. Посмотреть список команд.\n\
12. Посмотреть состав команды.\n";

exports.MainPrinter = class MainPrinter {
    constructor() {}

    authentification(signInP, successP) {
        console.log(`[AUTH OPERATION] in: ${signInP}, success: ${successP}\n`);
    }

    teamsManager(successP) {
        console.log(`[TEAMS MANAGER] success: ${successP}\n`);
    }

    playersManager(successP) {
        console.log(`[PLAYERS MANAGER] success: ${successP}\n`);
    }

    printInvite() {
        console.log(INVITE_MENU);
    }

    printError(e) {
        console.log(`Error occured (${e})`);
    }
}


