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
            description: 'CRUD de Users'
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

    comparePasswords(rawPassword, dbPassword) {
        return bcrypt.compareSync(rawPassword, dbPassword);
    }

    compareEmails(rawEmail, dbEmail) {
        return bcrypt.compareSync(rawEmail, dbEmail);
    }

    async updateUsers({
        nombre,
        avatar,
        password,
        estado,
        codigo
    }) {
        const result = await this.userDao.updateOne({
            codigo,
            nombre,
            avatar,
            password: bcrypt.hashSync(password),
            estado
        });
        return {
            nombre,
            password,
            avatar,
            estado,
            codigo,
            modified: result
        }
    }

    async updateUserPass({
        password,
        codigo
    }) {
        const result = await this.userDao.updateUserPass({
            password: bcrypt.hashSync(password)
        });
        return {
            codigo,
            password,
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