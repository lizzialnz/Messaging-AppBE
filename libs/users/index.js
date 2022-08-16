const DaoObject = require('../../dao/mongodb/DaoObject');
const bcrypt = require('bcryptjs');
module.exports = class Users {
    userDao = null;

    constructor(userDao = null) {
        if (!(userDao instanceof DaoObject)) {
            throw new Error('An Instance of DAO Object is Required');
        }
        this.userDao = userDao;
    }
    async init() {
        await this.userDao.init();
        await this.userDao.setup();
    }
    async getVersion() {
        return {
            entity: 'Users',
            version: '1.0.0',
            description: 'CRUD of Users'
        };
    }

    async addUsers({
        user,
        email,
        password,
        passwordtemp,
        expiracion,
        name,
        phone,
        status
    }) {
        const result = await this.userDao.insertOne(
            {
                user,
                email,
                password: bcrypt.hashSync(password),
                passwordtemp,
                expiracion,
                name,
                phone,
                status,
            }
        );
        return {
            user,
            email,
            password,
            passwordtemp,
            expiracion,
            name,
            phone,
            status,
            result,
        };
    };

    async getUsers() {
        return this.userDao.getAll();
    }

    async getUsersById({ codigo }) {
        return this.userDao.getById({ codigo });
    }

    async getUsersByEmail({ email }) {
        return this.userDao.getByEmail({ email });
    }

    async getByUsers({ user }) {
        return this.userDao.getByUser({ user });
    }

    comparePasswords(rawPassword, dbPassword) {
        return bcrypt.compareSync(rawPassword, dbPassword);
    }

    compareEmails(rawEmail, dbEmail) {
        return bcrypt.compareSync(rawEmail, dbEmail);
    }

    async updateUsers({
        user,
        email,
        password,
        passwordtemp,
        expiracion,
        name,
        phone,
        codigo
    }) {
        const result = await this.userDao.updateOne({
            codigo,
            user,
            email,
            password: bcrypt.hashSync(password),
            passwordtemp,
            expiracion,
            name,
            phone
        });
        return {
            user,
            email,
            password,
            passwordtemp,
            expiracion,
            name,
            phone,
            modified: result
        }
    }

    async updateuserPass({ codigo, passwordtemp }) {
        console.log(passwordtemp);
        const result = await this.userDao.updatePass({
            codigo,
            passwordtemp: bcrypt.hashSync(passwordtemp),
        });
        return {
            codigo,
            passwordtemp,
            modified: result
        }
    }

    async deleteUsers({ codigo }) {
        const userToDelete = await this.userDao.getById({ codigo });
        const result = await this.userDao.deleteOne({ codigo });
        return {
            ...userToDelete,
            deleted: result.changes
        };
    }
}