# PetShop - Sistema de Gerenciamento Completo 🐾

![Badge de Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Badge de Licença](https://img.shields.io/badge/license-N%2FA-lightgrey)
![Badge de Tecnologia Frontend](https://img.shields.io/badge/frontend-React-blue)
![Badge de Tecnologia Backend](https://img.shields.io/badge/backend-AWS%20Serverless-orange)

Este repositório apresenta o desenvolvimento completo do Sistema de Gerenciamento para PetShops, elaborado no contexto da disciplina de Processo de Software do curso Interdisciplinar em Tecnologia da Informação da Universidade Federal Rural do Semi-Árido (UFERSA) — Campus Pau dos Ferros.

O projeto contempla um frontend desenvolvido com React e um backend baseado em arquitetura serverless na AWS, utilizando API Gateway, AWS Lambda e DynamoDB. Todo o desenvolvimento foi orientado pela aplicação da metodologia Rational Unified Process (RUP), permitindo uma abordagem estruturada, incremental e iterativa.

O objetivo do sistema é automatizar e otimizar os processos operacionais de petshops, abrangendo o controle de clientes, pets, serviços e agendamentos, além de oferecer interfaces diferenciadas para os perfis de administradores e funcionários, visando maior eficiência, organização e gestão dos serviços.

---

## 📜 Visão Geral do Projeto

O objetivo principal é fornecer uma solução robusta e escalável para a gestão de petshops, facilitando o controle de informações e a organização dos serviços oferecidos. O desenvolvimento seguiu as fases e disciplinas do RUP de forma adaptada ao cronograma acadêmico, com ênfase na produção de artefatos de documentação e entregas incrementais.

**Principais Entidades Gerenciadas:**
* Usuários (Administradores, Funcionários)
* Clientes
* Pets
* Serviços
* Agendamentos

---

## ✨ Funcionalidades Principais

O sistema oferece um conjunto de funcionalidades para atender às necessidades dos diferentes perfis de usuário:

**Para Administradores:**
* Gerenciamento de Funcionários (Cadastro, Remoção)
* Gerenciamento de Serviços (Cadastro, Edição, Remoção, Visualização)

**Para Funcionários:**
* Gerenciamento de Clientes (Cadastro, Edição, Remoção, Visualização)
* Gerenciamento de Pets (Cadastro, Edição, Remoção, Visualização - associados a clientes)
* Gerenciamento de Agendamentos (Agendar, Alterar, Cancelar, Visualizar Histórico)
* Visualização de Serviços Disponíveis

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React:** Biblioteca JavaScript para construção de interfaces de usuário.
* **Vite / Create React App (CRA):** Ferramentas para inicialização e desenvolvimento de projetos React.
* **Tailwind CSS / Bootstrap (ou similar):** Para estilização e design responsivo.
* **Hospedagem:** AWS Amplify, Vercel ou Netlify (conforme definido pela equipe).

### Backend (Serverless)
* **AWS API Gateway:** Para criação, publicação, manutenção, monitoramento e proteção de APIs RESTful.
* **AWS Lambda:** Para execução da lógica de negócio (funções serverless em Python).
* **Amazon DynamoDB:** Banco de dados NoSQL gerenciado para persistência de dados.

### Ferramentas e Metodologia
* **Git & GitHub:** Para controle de versão e gerenciamento do projeto.
* **Rational Unified Process (RUP):** Metodologia de desenvolvimento de software.
* **Postman:** Para testes da API backend.
* **Markdown:** Para documentação.

---

## 🏗️ Arquitetura do Backend

O backend foi construído utilizando uma arquitetura serverless na AWS, o que oferece escalabilidade, flexibilidade e otimização de custos.

* **API Gateway:** Atua como o "portão de entrada" para todas as requisições HTTP, roteando-as para as funções Lambda apropriadas.
* **AWS Lambda:** Cada conjunto de funcionalidades relacionadas a uma entidade principal (ex: Usuários, Serviços, Clientes, Pets, Agendamentos) é gerenciado por uma função Lambda específica (ou uma função Lambda monolítica por recurso, como implementado). Essas funções contêm a lógica de negócio e interagem com o DynamoDB.
* **DynamoDB:** Utilizado para armazenar todos os dados da aplicação de forma persistente, com tabelas e índices secundários globais (GSIs) projetados para otimizar as consultas necessárias.

---

## 📚 Documentação

Toda a documentação relevante do projeto, incluindo a especificação de requisitos, plano de projeto, diagramas, documentação da API e evolução do projeto sob o RUP, pode ser encontrada na pasta [`backend-docs/`](./backend-docs/).

**Documentação da API Backend:**
* [API de Usuários](./backend-docs/api/usuarios_api.md) - URL Base: `https://fpbycte831.execute-api.us-east-1.amazonaws.com/dev/usuarios`
* [API de Serviços](./backend-docs/api/servicos_api.md) - URL Base: `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/servicos` (Conforme última info, verificar se este é o link correto para serviços ou se é unificado)
* [API de Clientes](./backend-docs/api/clientes_api.md) - URL Base: `https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes`
* [API de Pets](./backend-docs/api/pets_api.md) - URL Base: `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets`
* [API de Agendamentos](./backend-docs/api/agendamentos_api.md) - URL Base: `https://ba0wpj4u21.execute-api.us-east-1.amazonaws.com/dev/agendamentos`

*Nota: Os URLs base da API podem ter um prefixo comum. Verifique a documentação específica de cada API para os paths corretos.*

---

## 🚀 Como Configurar e Rodar o Frontend (Exemplo)

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/petshop-app-completo.git](https://github.com/SEU_USUARIO/petshop-app-completo.git)
    cd petshop-app-completo/frontend-react
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    # yarn install
    ```
3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz da pasta `frontend-react/` (se necessário) para configurar a URL base da API do backend.
    Exemplo de `.env`:
    ```
    REACT_APP_API_BASE_URL=https://SEU_ID_API.execute-api.SUA_[REGIAO.amazonaws.com/dev](https://REGIAO.amazonaws.com/dev)
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    # ou
    # yarn start
    ```
    A aplicação frontend deverá estar acessível em `http://localhost:3000` (ou outra porta, conforme configurado).

---

## 🧑‍💻 Equipe

* Claudio Caueh Oliveira Xavier
* Dayvison Eryc de Moura Silva
* José Carlos de Sousa
* Vitor Gabriel do Nascimento Silva

**Docente:** Prof. Bruno Borges da Silva

---

## 📊 Status do Projeto

Este projeto está **em desenvolvimento** como parte de uma avaliação acadêmica e visa aplicar os conceitos de processo de software e tecnologias de desenvolvimento web modernas.

---

*Este README foi gerado com o auxílio do Gemini. Última atualização: 27 de Maio de 2025.*

