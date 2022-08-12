const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class MessageDao extends DaoObject {
    constructor(db = null) {
        super(db, 'messages');
    }
    //   async setup() {
    //     if (process.env.MONGODB_SETUP) {
    //       const indexExists = await this.collection.indexExists('email');
    //       if (!indexExists) {
    //         await this.collection.createIndex({ email: 1 }, { unique: true });
    //       }
    //       const index2Exists = await this.collection.indexExists('user');
    //       if (!index2Exists) {
    //         await this.collection.createIndex({ user: 1 }, { unique: true });
    //       }
    //     }
    //   }

    getAll() {
        return this.find();
    }

    getById({ codigo }) {
        return this.findById(codigo);
    }
   

    insertOne({ sender, receiver, message }) {
        const newMessage = {
            sender,
            receiver,
            message,
            status: "SEND",
            created: new Date().toISOString(),
        }
        return super.insertOne(newMessage);
    }

    updateOne({ codigo, message }) {
        const updateCommand = {
            "$set": {
                message,
                status: "SEND",
                updated: new Date().toISOString()
            }
        }
        return super.updateOne(codigo, updateCommand);
    }

    deleteOne({ codigo }) {
        const updateCommand = {
            "$set": {
                status: "DELETE",
                updated: new Date().toISOString()
            }
        }
        return super.updateOne(codigo, updateCommand);
    }

}
