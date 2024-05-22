const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 1024 * 1024 * 20, 
        files: 1 
    },
    
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vuelos'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create/vuelo', upload.single('image'), (req, res) => {
    console.log('Datos recibidos:', req.body, req.file);
    if (!req.file) {
        return res.status(400).send('Imagen vacia');
    }

    const imagePath = req.file.path;
    const { pais, ciudad, iniciales } = req.body;
    console.log({pais, ciudad, iniciales});
    if (!pais || !ciudad || !iniciales) {
        return res.status(400).send('Faltan datos requeridos');
    }

    const query = 'INSERT INTO ubicacion (pais, ciudad, iniciales, foto) VALUES (?, ?, ?, ?)';
    db.query(query, [pais, ciudad, iniciales, imagePath], (err, result) => {
        if (err) {
            console.error('Error insertando los datos en la base de datos', err);
            res.status(500).send('Error interno del servidor, datos no ingresados');
            return;
        }
        res.status(200).send('La informacion se guardo exitosamente');
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/create/user', (req, res) => {
    const { nombre, apellido, email, password, edad, documento, nacionalidad } = req.body;
    const query = 'INSERT INTO usuario (nombre, apellido, email, password, edad, documento, nacionalidad) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [nombre, apellido, email, password, edad, documento, nacionalidad];

    db.query(query, values, (error, results) => {
        if (error) {
            console.log('Error al ejecutar la consulta:', error);
            return res.status(500).send('Error al crear usuario');
        }
        res.status(200).send('Usuario registrado con éxito');
    });
});

app.get('/vuelos', (req, res) => {
    const query = 'SELECT * FROM ubicacion';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving flights:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(result);
    });
});




app.listen(3001, () => {
    console.log('servidor abierto en el puerto 3001');
})
