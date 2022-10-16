const DaoObject = require('../../dao/mongodb/DaoObject');
const ncrypt = require('ncrypt-js');
var _secretKey = "some-super-secret-key";
var ncryptObject = new ncrypt(_secretKey);

module.exports = class Messages {
    messageDao = null;
    constructor(messageDao = null) {
        if (!(messageDao instanceof DaoObject)) {
            throw new Error('An Instance of DAO Object is Required');
        }
        
        this.messageDao = messageDao;
    }
    async init() {
        await this.messageDao.init();
        await this.messageDao.setup();
    }
    async getVersion() {
        return {
            entity: 'Messages',
            version: '1.0.0',
            description: 'CRUD of Messages'
        };
    }

    async addMessages({
        sender,
        receiver,
        message,
        status
    }) {
        const result = await this.messageDao.insertOne(
            {
                sender,
                receiver,
                // message: ncryptObject.encrypt(message),
                message: message ,
                status
            }
        );
        return {
            sender,
            receiver,
            message,
            status,
            result,
        };
    };

    async getMessages() {
        return this.messageDao.getAll();
    }
    

    async getMessagesById({ codigo }) {
        return this.messageDao.getById({ codigo });
    }
    async getMessagesByUser({ sender }) {
        return this.messageDao.getByMessages({ sender });

    }

    async getByMsgReceiver({ receiver }) {
        return this.messageDao.getByReceiver({ receiver });
    }
    async updateMessages({
        sender,
        receiver,
        message,
        codigo
    }) {
        const result = await this.messageDao.updateOne({
            codigo,
            sender,
            receiver,
            message: ncryptObject.encrypt(message),
        });
        return {
            sender,
            receiver,
            message,
            modified: result
        }
    }

    async deleteMessages({ codigo }) {
        const messagesToDelete = await this.messageDao.getById({ codigo });
        const result = await this.messageDao.deleteOne({ codigo });
        return {
            ...messagesToDelete,
            deleted: result.changes
        };
    }
}