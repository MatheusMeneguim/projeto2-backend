// app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configuração do EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados de formulário (body-parser)
app.use(express.urlencoded({ extended: true }));

// Rota para a página de login (GET)
app.get('/login', (req, res) => {
    // Renderiza a view 'login.ejs', passando 'error' como null inicialmente
    res.render('login', { error: null });
});

// Rota para processar o formulário de login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simples validação estática para a Parte 1 (sem banco de dados)
    if (username === 'admin' && password === 'admin') {
        console.log('Login protótipo bem-sucedido!');
        // Redireciona para a página protegida (dashboard)
        res.redirect('/dashboard');
    } else {
        console.log('Login protótipo falhou.');
        // Renderiza novamente a página de login com uma mensagem de erro
        res.render('login', { error: 'Usuário ou senha inválidos para o protótipo.' });
    }
});

// Rota para a página protegida (dashboard)
app.get('/dashboard', (req, res) => {
    // Na Parte 1, esta página é acessível diretamente para demonstração do frontend.
    // Na Parte 2, ela será protegida por autenticação.
    res.render('dashboard');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Acesse http://localhost:3000/login para testar a Parte 1.');
});
