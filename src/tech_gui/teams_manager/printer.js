exports.TeamsPrinter = class TeamsPrinter {
    printTeam(t) {
        console.log(`${t.id}. ${t.name}`);
    }

    inviteTeamName() {
        console.log("Введите название команды: ");
    }

    inviteTeamId() {
        console.log("Введите Id команды: ");
    }

    invitePlayerId() {
        console.log("Введите Id игрока: ");
    }

    printPlayers(ps) {
        ps.forEach(p => console.log(`${p.id}. ${p.fname} ${p.lname}, ${p.cntry} (${p.dob})`));
    }
}

