import { PermissionError, NotFoundError } from "../error.js";

class UsersService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }

    async addUser(user) {
        user.password = mapPassword(user.password)
        return this.usersRepo.addUser(user);
    }

    async updateUser(user) {
        // TODO: remove password update?
        user.password = mapPassword(user.password)
        return this.usersRepo.updateUser(user);
    }

    async getUserByUsername(username) {
        return this.usersRepo.getUserByUsername(username);
    }
};

export default UsersService;
