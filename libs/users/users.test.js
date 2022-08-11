const Usuario = require('./index.js');
const Conexion = require('../../dao/mongodb/Connection');
const UsersDao = require('../../dao/mongodb/models/UsersDao');
const fs = require('fs');


describe('Testing Usuarios CRUD', ()=>{
  const env = process.env;
  let db, UsrDao, Usr;
  // Dado que .... al ejecutar | procesar | activar .... se espera que .....
  beforeAll(async ()=>{
    jest.resetModules();
    process.env = {
        ...env,
        MONGODB_URI: "mongodb+srv://lizzialnz:seminariotaller@mi-cluster1.65cl4kc.mongodb.net/test",
        MONGODB_DB: "messagingdb",
        MONGODB_SETUP: 1,
      };
    db = await Conexion.getDB();
    UsrDao = new UsersDao(db);
    Usr = new Usuario(UsrDao);
    await Usr.init();

    await Usr.addUsers(
      { user:'lizzi123', email:'lizzi1@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Lizzi Silva', phone:'99977887', status:'ON' }
    );
    await Usr.addUsers(
      { user:'lizzi123', email:'lizzi2@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Lizzi Silva', phone:'99977887', status:'ON' }
    );
    await Usr.addUsers(
      { user:'lizzi123', email:'lizzi3@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Lizzi Silva', phone:'99977887', status:'ON' }
    );
    return true;
  });
  afterAll(async ()=>{
    db.close();
    fs.unlinkSync(`data/${process.env.MONGODB_DB}`);
    process.env = env;
    return true;
  });

  test('Usuarios insertOne', async ()=>{
    const result = await Usr.addUsers({ user:'lizzi123', email:'lizzimalore@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Lizzi Silva', phone:'99977887', status:'ON'});
    console.log(result);
    id = result.insertedId;
    console.log(id);
    expect(result.acknowledged).toBe(true);
  });

  test('Usuarios getAll Records', async ()=>{
    const results = await Usr.getUsers();
    expect(results.length).toBeGreaterThan(1);
  });

  test('Usuarios updateOne Record', async ()=>{
    const record = await Usr.getUserById({_id:'62f1e045f69bcbfa5001e83b'});
    const updatedRecord = await Usr.updateUsers({
        _id:'62f1e045f69bcbfa5001e83b',
      user:'lizzi123', email:'lizzimalo@gmail.com',password:'lizzi123', passwordtemp:'',expiracion:'', name:'Test 2 UPD', phone:'99977887', status:'ON'
    });
    expect(updatedRecord?.name).toEqual(expect.stringContaining('UPD'));
  });

  test('Usuario DeleteOne', async ()=>{
    const deletedRecord = await Usr.deleteUsers({ codigo: id });
    console.log(deletedRecord);
    expect(deletedRecord.acknowledged).toBe(true);
  });

  test('Usuario password Crypted', async ()=>{});
  test('Usuario login ok', async ()=>{});
  test('Usuario login failed', async ()=>{});
  test('Usuario email duplicate', async ()=>{});
});
