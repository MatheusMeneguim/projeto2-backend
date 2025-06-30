# Sistema de Autenticação Web Minimalista

Este projeto é uma aplicação web completa com autenticação de usuário, desenvolvida com Node.js, Express e MongoDB, seguindo uma arquitetura MVC minimalista e focando na simplicidade e concisão do código e na baixa contagem de arquivos. Ideal para demonstrar um fluxo de autenticação seguro e eficiente em um ambiente restrito.

## Funcionalidades Implementadas

*   **Autenticação de Usuário:** Login seguro com validação de credenciais contra o MongoDB.
*   **Segurança de Senhas:** Armazenamento seguro de senhas com `bcrypt` (hashing e salting).
*   **Gerenciamento de Sessão:** Utilização de `express-session` e cookies para manter o estado de login do usuário.
*   **Página de Login (`/login`):**
    *   Interface de usuário funcional e visualmente agradável.
    *   Formulário para entrada de email/usuário e senha.
    *   Tratamento de erros para credenciais inválidas (feedback para o usuário).
*   **Página Protegida (`/dashboard`):**
    *   Acessível somente após login bem-sucedido.
    *   Redirecionamento automático para a página de login caso um usuário não autenticado tente acessar.
*   **Logout:** Funcionalidade para encerrar a sessão do usuário.
*   **Usuário Pré-definido:** Um usuário padrão é criado no banco de dados na inicialização da aplicação para facilitar os testes.
*   **Estrutura MVC Minimalista:** Lógica de aplicação organizada de forma concisa em poucos arquivos.

## Tecnologias Utilizadas

*   **Backend:** Node.js com [Express.js](https://expressjs.com/)
*   **Banco de Dados:** [MongoDB](https://www.mongodb.com/) com [Mongoose.js](https://mongoosejs.com/) (ODM)
*   **Segurança:** [bcrypt.js](https://www.npmjs.com/package/bcrypt) para hashing de senhas
*   **Sessões:** [express-session](https://www.npmjs.com/package/express-session) para gerenciamento de sessão
*   **Frontend:** HTML/CSS com [EJS](https://ejs.co/) (Embedded JavaScript) como motor de template

## Estrutura do Projeto

O projeto foi projetado para ser extremamente conciso, com o objetivo de manter o número de arquivos fonte baixo. Toda a lógica de backend (servidor, rotas, modelo de usuário, autenticação e sessões) está contida em um único arquivo JavaScript.
