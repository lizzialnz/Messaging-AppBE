const path = require('path');
const dotenv = require('dotenv');
const UsersDao = require('./UsersDao');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const Connection = require('../Connection');
const { hasUncaughtExceptionCaptureCallback } = require('process');

describe("Testing Users Crud in MongoDB", () => {
  const env = process.env;
  let db, UserDao, Cat, id;
  beforeAll(async () => {
    jest.resetModules();
    process.env = {
      ...env,
      MONGODB_URI: "mongodb+srv://lizzialnz:seminariotaller@mi-cluster1.65cl4kc.mongodb.net/test",
      MONGODB_DB: "messagingdb",
      MONGODB_SETUP: 1,
    };
    db = await Connection.getDB();
    UserDao = new UsersDao(db,'users');
    await UserDao.init();
    return true;
  });
  afterAll(async()=>{
    process.env = env;
    return true;
  });
  test('Get All Records', async ()=>{
    const result = await UserDao.getAll();
    console.log(result);
  });
  test('Insert One Record', async ()=>{
    const result = await UserDao.insertOne({ user:'lizzi123', email:'lizzi123@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Lizzi Silva', phone:'99977887', status:'ON'});
    console.log(result);
    id = result.insertedId;
    expect(result.acknowledged).toBe(true);
  });
  test('FindById Record', async ()=>{
    const record = await UserDao.getById({codigo:id.toString()});
    console.log(record);
    expect(record._id).toStrictEqual(id);
  });
  test('Update One Record', async ()=>{
    const updateResult = await UserDao.updateOne({codigo:id.toString(), user:'lizzi123', email:'lizzi123@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Lizzi Silva', phone:'99977887', status:'ON'});
    console.log(updateResult);
    expect(updateResult.acknowledged).toBe(true);
  });
  test('Delete One Record', async () => {
    const deleteResult = await UserDao.deleteOne({ codigo: id.toString() });
    console.log(deleteResult);
    expect(deleteResult.acknowledged).toBe(true);
  });
});
