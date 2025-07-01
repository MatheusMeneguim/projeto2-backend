const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'sua_chave_secreta_aqui_muito_segura_e_aleatoria',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));

const mongoURI = 'mongodb://localhost:27017/auth_db';

mongoose.connect(mongoURI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro de conexão ao MongoDB:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

async function seedUser() {
    try {
        const existingUser = await User.findOne({ username: 'matheus' });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('marketing123', 10);
            const newUser = new User({
                username: 'matheus',
                password: hashedPassword
            });
            await newUser.save();
            console.log('Usuário padrão "matheus" criado com sucesso!');
        } else {
            console.log('Usuário "matheus" já existe no banco de dados.');
        }
    } catch (error) {
        console.error('Erro ao criar usuário padrão:', error);
    }
}
seedUser();

function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/login', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('login', { error: error });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            req.session.error = 'Credenciais inválidas.';
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.userId = user._id;
            console.log(`Usuário ${username} logado com sucesso!`);
            res.redirect('/dashboard');
        } else {
            req.session.error = 'Credenciais inválidas.';
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Erro no processo de login:', err);
        req.session.error = 'Ocorreu um erro ao tentar fazer login.';
        res.redirect('/login');
    }
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).send('Erro ao fazer logout.');
        }
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Acesse http://localhost:3000/login para testar a autenticação.');
    console.log('Usuário de teste: matheus / marketing123');
});