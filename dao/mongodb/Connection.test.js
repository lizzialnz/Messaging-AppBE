const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Connection = require('./Connection');

describe('Probando Connection con Mongodb', ()=>{
  beforeAll( async()=>{
    return true;
  })
  test('Probando Conexion a DB', async ()=>{
    const db = await Connection.getDB();
    expect(db).toBeDefined();
  });

  test('Probando Conexion a DB cacheada', async () => {
    const db = await Connection.getDB();
    expect(db).toBeDefined();
  });
});
