const express = require('express');
const router = express.Router();
const Userlibs = require('../../../../libs/users');
const Usermodels = require('../../../../dao/mongodb/models/UsersDao');
const userDao = new Usermodels();
const users = new Userlibs(userDao);
users.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await users.getVersion();
    return res.status(200).json(versionData);
  } catch (ex) {
    // manejar el error que pueda tirar el controlador
    console.error('Error User', ex);
    return res.status(502).json({ 'error': 'Error Interno de Server' });
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const users = await users.getUsers();
    return res.status(200).json(users);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const registration = await users.getUserById({ codigo });
    return res.status(200).json(registration);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.post('/new', async (req, res) => {
  try {
    const {
      user = '',
      email = '',
      password = '',
      passwordtemp = '',
      expiracion = '',
      name = '',
      phone = '' } = req.body;
    if (/^\s*$/.test(user)) {
      return res.status(400).json({
        error: 'Se espera un usuario'
      });
    }

    if (/^\s*$/.test(email)) {
      return res.status(400).json({
        error: 'Se espera un correo'
      });
    }
    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    if (/^\s*$/.test(name)) {
      return res.status(400).json({
        error: 'Se espera un nombre'
      });
    }
    if (/^\s*$/.test(phone)) {
      return res.status(400).json({
        error: 'Se espera número de teléfono'
      });
    }

    const newUser = await users.addUsers({
      user,
      email,
      password,
      passwordtemp,
      expiracion,
      name,
      phone,
    });

    return res.status(200).json(newUser);
  } catch (ex) {
    console.error(ex);
    console.log("Es posible que:\n1. El correo ya este vinculado a una cuenta \n2. El nombre de usuario ya existe");
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});

router.put('/update/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }
    const { user, password, name, phone, status } = req.body;

    if (/^\s*$/.test(user)) {
      return res.status(400).json({
        error: 'Se espera un usuario'
      });
    }
    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    if (/^\s*$/.test(name)) {
      return res.status(400).json({
        error: 'Se espera un nombre'
      });
    }
    if (/^\s*$/.test(phone)) {
      return res.status(400).json({
        error: 'Se espera número de teléfono'
      });
    }
    if (!(/^(OFF)|(ON)$/.test(status))) {
      return res.status(400).json({
        error: 'Se espera valor de estado en OFF - ON'
      });
    }

    const updateResult = await users.updateUsers({
      user,
      email,
      password,
      name,
      phone,
      status,
      codigo
    });

    if (!updateResult) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    return res.status(200).json({ updatedCategory: updateResult });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deleteUsers = await users.deleteUsers({ codigo: parseInt(codigo) });

    if (!deleteUsers) {
      return res.status(404).json({ error: 'Categoria no encontrada.' });
    }
    return res.status(200).json({ deleteUsers });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;
