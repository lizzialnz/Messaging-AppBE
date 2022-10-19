const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class MessageDao extends DaoObject {
    constructor(db = null) {
        super(db, 'messages');
    }
    async setup() {
        if (process.env.MONGODB_SETUP) {
         // TODO: Agregar Indices
        }
      }
      
    getAll() {
        return this.find();
    }

    getById({ codigo }) {
        return this.findById(codigo);
    }
    getByMessages({ sender }) {
        const estado = "SEND";
        return this.find({sender:sender,status:estado});
    }

    getByReceiver({ receiver }) {
        const estado = "SEND";
        return this.find({receiver:receiver, status:estado});
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
