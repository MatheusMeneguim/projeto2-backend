# Projeto de Autenticação Web - Base e Frontend

Este é o primeiro estágio de um projeto de aplicação web com autenticação, focado na montagem da estrutura base do servidor Express e na criação das interfaces de usuário para as páginas de login e dashboard.

**Objetivo desta Parte:**

*   Configurar um servidor Node.js com Express.
*   Configurar o EJS como motor de template para renderizar páginas dinâmicas.
*   Servir arquivos estáticos (CSS) para estilização.
*   Criar interfaces de login e dashboard visualmente agradáveis.
*   Implementar uma **validação de login estática simples** (usuário: `admin`, senha: `admin`) para demonstração, sem persistência em banco de dados ou sessões reais ainda.

**Tecnologias Utilizadas:**

*   Node.js
*   Express
*   EJS (Embedded JavaScript)
*   HTML/CSS

**Estrutura de Arquivos:**
 ├── app.js ├── public/ │ └── style.css └── views/ ├── login.ejs └── dashboard.ejs