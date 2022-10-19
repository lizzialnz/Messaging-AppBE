const express =require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
let router = express.Router();
const Usuario = require('../../../libs/users');
const UsuarioDao = require('../../../models/mongodb/UsersDao');
const userDao = new UsuarioDao();
const users = new Usuario(userDao);
users.init();

const {jwtSign} = require('../../../libs/security');

router.post('/login', async (req, res)=>{
  try {
    const {user, password} = req.body;
    const userData = await users.getByUsers({user});
    const fecha = new Date();
    console.log(userData);
    if(userData){
      
    if(bcrypt.compareSync(password,userData.passwordtemp) && userData.expiracion > fecha){
      console.log("Contraseña Correcta, Bienvenido al Sistema "+user);
    } else if(! users.comparePasswords(password, userData.password)) {
      console.error('security login: ', {error:`Credenciales incorrectas para usuario ${userData._id} ${userData.user} incorrectas.`});
      return res.status(403).json({ "error": "nombre de usuario o contraseña incorrecto" });
    }
    const {password: passwordDb, created, updated, ...jwtUser} = userData;
    const jwtToken = await jwtSign({jwtUser, generated: new Date().getTime()});
    return res.status(200).json({token: jwtToken, name: userData.name});
}else{
    console.log("Nombre de usuario incorrecto o nose encuentra registrado");
}
  } catch (ex) {
    console.error('security login: ', {ex});
    return res.status(500).json({"error":"No es posible procesar la solicitud."});
  }
});

router.post('/recover', async (req, res)=>{
  try {
    let testAccount = await nodemailer.createTestAccount();
    const {email} = req.body;
    const userData = await users.getUsersByEmail({email});
    if(!userData) {
      return res.status(403).json({ "error": "El correo no se encuentra registrado" });
    }
    const codigo = userData._id;
    let transporter = nodemailer.createTransport({
      host: process.env.CORREO_SERVICIO,
      port: process.env.CORREO_PORT,
      secure: true, // true for 465, false for other ports
      auth:{
        user: process.env.APP_CORREO,
        pass: process.env.CORREO_CONTRASENA,
    },
    STARTTLS: {
      rejectUnauthorized: false
  }
    });

    const minus = "abcdefghijklmnñopqrstuvwxyz";
    const mayus = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    var passwordtemp = '';
    for (var i = 1; i <= 8; i++) {
      var eleccion = Math.floor(Math.random() * 3 + 1);
      if (eleccion == 1) {
        var caracter1 = minus.charAt(Math.floor(Math.random() * minus.length));
        passwordtemp += caracter1;
      } else {
        if (eleccion == 2) {
          var caracter2 = mayus.charAt(Math.floor(Math.random() * mayus.length));
          passwordtemp += caracter2;
        } else {
          var num = Math.floor(Math.random() * 10);
          passwordtemp += num;
        }
      }
    }
    let info = transporter.sendMail({
      from: process.env.APP_CORREO, // sender address
      to: email, // list of receivers
      subject: "Recuperación de contraseña", // Subject line
      text: 'Contraseña administrativa: ', // plain text body
      html: "<b>Esta es una contraseña temporal que expirará en 24 horas. Por favor cambie su contraseña al ingresar <br><br>Contraseña temporal: </b>"+passwordtemp, // html body
    });
    const newpass = await users.updateuserPass({codigo,passwordtemp});
    console.log(info);
    console.log(newpass);
    return res.status(200).json("Email enviado");
  } catch (ex) {
    console.error('security login: ', {ex});
    return res.status(500).json({"error":"No es posible procesar la solicitud."});
  }
});

router.post('/updatepassword', async (req, res) => {
  try {
    const fecha = new Date();
    const {user,password, confirmpassword} = req.body;
    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    if (confirmpassword!=password) {
      return res.status(400).json({
        error: 'Las contraseñas no coinciden'
      });
    }
    const userData = await users.getByUsers({user});
    const codigo = userData._id;
    if(confirmpassword == userData.password){
      console.log("La contraseña es la misma que la anterior, cambiela al ingresar");
    }
    var passwordtemp = password;
    const newpass = await users.updateuserPass({codigo,passwordtemp});
    return res.status(200).json("Nueva contraseña almacenada correctamente");
  } catch (ex) {
    console.error('security signIn: ', ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});


module.exports = router;
