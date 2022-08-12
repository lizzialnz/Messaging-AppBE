const express = require('express');
const router = express.Router();
const Messagelibs = require('../../../../libs/messages');
const Messagemodels = require('../../../../dao/mongodb/models/MessagesDao');
const messageDao = new Messagemodels();
const messages = new Messagelibs(messageDao);
messages.init();

router.get('/', async (req, res) => {
    // extraer y validar datos del request
    try {
        // devolver la ejecución el controlador de esta ruta
        const versionData = await messages.getVersion();
        return res.status(200).json(versionData);
    } catch (ex) {
        // manejar el error que pueda tirar el controlador
        console.error('Error User', ex);
        return res.status(502).json({ 'error': 'Error Interno de Server' });
    }
}); // get /

router.get('/all', async (req, res) => {
    try {
        const message = await messages.getMessages();
        return res.status(200).json(message);
    } catch (ex) {
        console.error(ex);
        return res.status(501).json({ error: 'Error al procesar solicitud.' });
    }
});

router.get('/byid/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const registration = await messages.getMessagesById({ codigo });
        return res.status(200).json(registration);
    } catch (ex) {
        console.error(ex);
        return res.status(501).json({ error: 'Error al procesar solicitud.' });
    }
});




router.post('/new', async (req, res) => {
    try {
        const {
            sender = '',
            receiver = '',
            message = '' } = req.body;
        if (/^\s*$/.test(sender)) {
            return res.status(400).json({
                error: 'Se espera un emisor'
            });
        }

        if (/^\s*$/.test(receiver)) {
            return res.status(400).json({
                error: 'Se espera un receptor'
            });
        }
        if (/^\w*$/.test(message)) {
            return res.status(400).json({
                error: 'Se espera un mensaje'
            });
        }

        const newMessage = await messages.addMessages({
            sender,
            receiver,
            message
        });
        return res.status(200).json(newMessage);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({ error: 'Error al procesar solicitud' });
    }
});

router.put('/update/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        if (!(/^\w*$/.test(codigo))) {
            return res.status(400).json({ error: 'El codigo debe ser una cadena de 24 dígitos.' });
        }
        const { sender, receiver, message, } = req.body;

        if (/^\s*$/.test(sender)) {
            return res.status(400).json({
                error: 'Se espera un emisor'
            });
        }

        if (/^\s*$/.test(receiver)) {
            return res.status(400).json({
                error: 'Se espera un receptor'
            });
        }
        if (/^\w*$/.test(message)) {
            return res.status(400).json({
                error: 'Se espera un mensaje'
            });
        }

            const updateResult = await messages.updateMessages({
                sender,
                receiver,
                message,
                codigo
            });

            if (!updateResult) {
                return res.status(404).json({ error: 'Mensaje no encontrado.' });
            }
            return res.status(200).json({ updateMessages: updateResult });

    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: 'Error al procesar solicitud.' });
    }
});


router.delete('/delete/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        if (!(/^\w*$/.test(codigo))) {
            return res.status(400).json({ error: 'El codigo debe ser una cadena de 24 dígitos.' });
        }

        const deleteMessages = await messages.deleteMessages({ codigo: codigo });

        if (!deleteMessages) {
            return res.status(404).json({ error: 'Mensaje no encontrada.' });
        }
        return res.status(200).json({ deleteMessages });
    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: 'Error al procesar solicitud.' });
    }
});



module.exports = router;
