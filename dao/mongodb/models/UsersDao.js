const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class UsersDao extends DaoObject {
  constructor(db = null) {
    super(db, 'users');
  }
  async setup() {
    if (process.env.MONGODB_SETUP) {
      const indexExists = await this.collection.indexExists('email');
      if (!indexExists) {
        await this.collection.createIndex({ email: 1 }, { unique: true });
      }
      const index2Exists = await this.collection.indexExists('user');
      if (!index2Exists) {
        await this.collection.createIndex({ user: 1 }, { unique: true });
      }
    }
  }

  getAll() {
    return this.find();
  }

  getById({ codigo }) {
    return this.findById(codigo);
  }

  getByEmail({ email }) {
    return this.findOne({ email });
  }
  getByUser({ user }) {
    return this.findOne({ user });
  }

  insertOne({ user, email, password, passwordtemp, expiracion, name, phone }) {
    const newUser = {
      user,
      email,
      password,
      passwordtemp,
      expiracion,
      name,
      phone,
      status: "ON",
      created: new Date().toISOString(),
    }
    return super.insertOne(newUser);
  }

  updateOne({ codigo, user, email, password, passwordtemp, expiracion, name, phone }) {
    const updateCommand = {
      "$set": {
        user,
        email,
        password,
        passwordtemp,
        expiracion,
        name,
        phone,
        status: "ON",
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

  updatePass({ codigo, passwordtemp }) {
    const fecha = new Date();
    fecha.setSeconds(28800);
    console.log(fecha);
    const updateCommand = {
      "$set": {
        passwordtemp,
        expiracion: fecha,
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

  newPassword({ codigo, password }) {
    const updateCommand = {
      "$set": {
        password,
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }


  deleteOne({ codigo }) {
    const updateCommand = {
      "$set": {
        status: 'OFF',
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

}
