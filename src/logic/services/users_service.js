import { PermissionError, NotFoundError } from "../error.js";
import { mapPassword } from "../common.js";

class UsersService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }

    async addUser(user) {
        user.password = mapPassword(user.password)
        user.plevel = 0;
        return this.usersRepo.addUser(user);
    }

    async updateUserPassword(userId, password) {
        password = mapPassword(password)
        return this.usersRepo.updateUserPassword(userId, password);
    }

    async updateUser(user) {
        return this.usersRepo.updateUser(user);
    }

    async getUserByUsername(username) {
        return this.usersRepo.getUserByUsername(username);
    }
};

export default UsersService;
