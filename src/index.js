const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}));


app.engine(
    "hbs", 
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);


app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));


const getSessionName = req => req.session.nombre? req.session.nombre: ''

app.get('/login', (req, res)=>{
    if(req.session.nombre) {
        res.render("welcome", {
            nombre: req.session.nombre
        })
    } else {
        res.sendFile(process.cwd() + '/public/login.html');
    }
})

app.post('/login', (req, res)=>{
    let { nombre } = req.body;
    req.session.nombre = nombre;
    res.redirect('/');
    console.log('Usuario activo');
    console.log('Nombre de uaurio:', nombre);
})

app.get('/logout', (req, res)=>{
    let nombre = getSessionName(req);
    
    if(nombre) {
        req.session.destroy( err => {
            if(!err) {
                res.render("logout", { nombre });
                console.log('cerrar sesion');
            } else {
                res.redirect('/');
            }
        })
    }
})

app.listen(8080, ()=>{
    console.log(`Listening on port 8080`);
})