-- user: id, login, password, plevel
-- team: id, name, owner, date
-- player: fname, lname, entry, dob
-- teamplayer: team_id, player_id


CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    login varchar,
    password varchar,
    plevel int
);

CREATE TABLE IF NOT EXISTS teams (
    id serial primary key,
    name varchar,
    owner_id int,
    FOREIGN KEY (owner_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS players (
    id serial primary key,
    fname varchar,
    lname varchar,
    cntry varchar,
    dob date
);

CREATE TABLE IF NOT EXISTS teamplayer (
    team_id int,
    player_id int,
    FOREIGN KEY (team_id) REFERENCES teams (id),
    FOREIGN KEY (player_id) REFERENCES players (id)
);
