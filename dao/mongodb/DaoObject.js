const ObjectId = require('mongodb').ObjectId;
const Connection = require('./Connection');

module.exports = class DaoObject {
  conn = null;
  collectionName = null;
  collection = null;

  constructor(db = null, collection = null) {
    if (db) {
      this.conn = db;
    }
    if (collection) {
      this.collectionName = collection;
    }
  }
  async init() {
    if (!this.conn) {
      try {
        this.conn = await Connection.getDB();
      } catch (ex) {
        console.log('DaoObject : ', ex);
        throw ex;
      }
    }
    if(!this.collection){
      try {
        this.collection = await this.conn.collection(this.collectionName);
      } catch (ex) {
        console.log('DaoObject : ', ex);
      }
    }
  }

  find(query={}, projection=null, orderBy=null, limit=null, skip=null, returnCursor=false){
    const options = {
      projection,
      sort:orderBy,
      limit,
      skip
    }
    if(returnCursor)
      return this.collection.find(query, options);
    else
      return this.collection.find(query, options).toArray();
  }

  findById(_id){
    const queryId = {_id: new ObjectId(_id)}
    return this.collection.findOne(queryId);
  }

  findOne(query = {}, projection = null ){
    const options = {
      projection
    };
    return this.collection.findOne(query, options);
  }

  insertOne(docToInsert={}){
    if(docToInsert === {} ) {
      throw Error('A document to be inserted is needed.');
    }
    return this.collection.insertOne(docToInsert);
  }

  updateOne(_id, queryCommand){
    return this.collection.updateOne({_id:new ObjectId(_id)}, queryCommand);
  }
  removeOne(_id){
    return this.collection.deleteOne({_id: new ObjectId(_id)});
  }
  aggregate(stages){
    return this.collection.aggregate(stages).toArray();
  }

}
