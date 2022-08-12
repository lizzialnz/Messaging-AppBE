const MongoClient = require('mongodb').MongoClient;

module.exports = class Connection {
  static db = null;
  static async getDB() {
    if (this.db === null) {
      const mongoUri = process.env.MONGODB_URI;
      const mongoDbName = process.env.MONGODB_DB;
      var mongoClient = await MongoClient.connect(mongoUri);
      this.db = mongoClient.db(mongoDbName);
      console.log('Connection: ', 'Creando Conexión');
    } else {
      console.log('Connection: ', 'Usando Conexión Cacheada');
    }
    return this.db;
  }
}
