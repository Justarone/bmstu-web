import sha256 from "js-sha256";

const ADMIN_LEVEL = 1;
const SECRET = "my_secret";

const isAdmin = user => user.plevel === ADMIN_LEVEL;
const mapPassword = password => sha256(password);

//const verifyPromo = promo => promo === "admin";

//const validateUserId = id => {
    //if (!id || !goodUserId(id))
        //throw new LogicError("Bad user id (null or can't be verified)");
//}

//const validateLoginPassword = (login, password) => {
    //if (login.length < 3 || login.length > 20)
        //throw new LogicError(`login length must be between 3 and 20`)
    //if (password.length < 4 && password.length > 20)
        //throw new LogicError(`password length must be between 4 and 20`);
//}

//const goodUserId = id => id > 0;

export { SECRET, isAdmin, mapPassword };
