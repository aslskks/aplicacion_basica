const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

// Lista de usuarios registrados y permisos por defecto
let users = [];
let defaultPermissions = {
    buyItem: true,
    viewInventory: true,
    transferMoney: true
};

// Lista de artículos disponibles para comprar
let availableItems = [];

// Middleware para analizar el cuerpo de las solicitudes entrantes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Función middleware para verificar si el usuario es un administrador
function isAdmin(req, res, next) {
    const { username } = req.body;
    const user = users.find(u => u.username === username);
    if (user && user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Acceso no autorizado' });
    }
}

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = { id: uuid.v4(), username, password, isAdmin: false, permissions: defaultPermissions };
    users.push(newUser);
    res.json({ message: 'Usuario registrado correctamente', user: newUser });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'Inicio de sesión exitoso', user });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

// Ruta para acceder al dashboard
app.get('/dashboard', (req, res) => {
    res.json({ message: 'Dashboard' });
});

// Ruta para comprar un artículo
app.post('/buy-item', (req, res) => {
    const { itemId, username } = req.body;
    const user = users.find(u => u.username === username);
    const item = availableItems.find(item => item.id === itemId);
    if (user && item && user.permissions.buyItem) {
        // Lógica real para procesar la compra del artículo
        res.json({ message: `Compraste el artículo: ${item.name}` });
    } else {
        res.status(401).json({ message: 'No tienes permiso para comprar este artículo' });
    }
});

// Ruta para cambiar permisos de un usuario (solo para administradores)
app.post('/change-permissions', isAdmin, (req, res) => {
    const { username, permissions } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        user.permissions = permissions;
        res.json({ message: 'Permisos de usuario actualizados correctamente' });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Ruta para agregar un artículo disponible para comprar (solo para administradores)
app.post('/add-item', isAdmin, (req, res) => {
    const { name, price } = req.body;
    const newItem = { id: uuid.v4(), name, price };
    availableItems.push(newItem);
    res.json({ message: 'Artículo agregado correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
