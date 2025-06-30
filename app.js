// app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Para gerenciar sessões
const app = express();
const port = 3000;

// --- Configurações Iniciais ---
// Configuração do EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados de formulário (body-parser)
app.use(express.urlencoded({ extended: true }));

// --- Configuração de Sessão ---
// Para 'express-session', você precisa de um 'secret' forte para assinar os cookies de sessão.
// Pode ser uma string aleatória. Em produção, use variáveis de ambiente.
app.use(session({
    secret: 'sua_chave_secreta_aqui_muito_segura_e_aleatoria', // Troque por uma string real e complexa
    resave: false, // Não salva a sessão se não houver modificações
    saveUninitialized: false, // Não salva sessões não inicializadas
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Duração do cookie: 24 horas (em milissegundos)
        httpOnly: true // O cookie não pode ser acessado via JavaScript do lado do cliente
    }
}));

// --- Conexão ao MongoDB e Modelo de Usuário ---
const mongoURI = 'mongodb://localhost:27017/auth_db'; // Substitua pelo seu URI do MongoDB

mongoose.connect(mongoURI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro de conexão ao MongoDB:', err));

// Definição do Schema e Modelo de Usuário (consolidado em app.js para concisão)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- Seeding: Adicionar um usuário padrão se não existir ---
async function seedUser() {
    try {
        const existingUser = await User.findOne({ username: 'matheus' });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('marketing123', 10); // Senha para teste
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
seedUser(); // Chama a função para criar o usuário padrão ao iniciar a aplicação

// --- Middleware de Proteção de Rota ---
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) { // Verifica se há um ID de usuário na sessão
        next(); // Se sim, continua para a próxima rota (usuário autenticado)
    } else {
        res.redirect('/login'); // Se não, redireciona para a página de login
    }
}

// --- Rotas da Aplicação ---

// Rota para a página de login (GET)
app.get('/login', (req, res) => {
    // Renderiza a view 'login.ejs', passando 'error' se houver um na sessão
    const error = req.session.error;
    req.session.error = null; // Limpa o erro após exibir
    res.render('login', { error: error });
});

// Rota para processar o formulário de login (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            req.session.error = 'Credenciais inválidas.';
            return res.redirect('/login');
        }

        // Compara a senha fornecida com o hash armazenado
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.userId = user._id; // Armazena o ID do usuário na sessão
            console.log(`Usuário ${username} logado com sucesso!`);
            res.redirect('/dashboard'); // Redireciona para a página protegida
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

// Rota para a página protegida (dashboard)
// Aplica o middleware 'ensureAuthenticated' antes de renderizar
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard'); // Renderiza o dashboard se o usuário estiver autenticado
});

// Rota de Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => { // Destrói a sessão
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).send('Erro ao fazer logout.');
        }
        res.redirect('/login'); // Redireciona para a página de login após o logout
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Acesse http://localhost:3000/login para testar a autenticação.');
    console.log('Usuário de teste: matheus / marketing123');
});