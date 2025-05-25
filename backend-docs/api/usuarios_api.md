# Documentação da API - Gerenciamento de Usuários PetShop

Esta API permite realizar operações CRUD (Criar, Ler, Atualizar, Deletar) para os usuários do sistema PetShop.

**URL Base:**

A URL base para todos os endpoints da API é:
`https://<seu-id-da-api>.execute-api.<sua-regiao>.amazonaws.com/<seu-estagio>`

Por exemplo, se o ID da sua API for `abcdef123`, sua região for `us-east-1` e seu estágio for `dev`, a URL base será:
`https://abcdef123.execute-api.us-east-1.amazonaws.com/dev`

**Autenticação:**

Atualmente, esta API não requer autenticação.

**Formato dos Dados:**

Todas as requisições e respostas que contêm um corpo (body) utilizam o formato `application/json`.

**Observação Importante sobre Senhas:**

No estado atual, o campo `senha` é armazenado como texto plano. Em um ambiente de produção, é crucial implementar o hashing de senhas para garantir a segurança.

---

## Endpoints

### 1. Criar Usuário

* **Método:** `POST`
* **Path:** `/usuarios`
* **Descrição:** Cria um novo usuário no sistema.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Nome do Usuário",
        "email": "usuario@example.com",
        "senha": "senhaDoUsuario123",
        "tipoUsuario": "Administrador"
    }
    ```
    * `nome` (String, Obrigatório): Nome completo do usuário.
    * `email` (String, Obrigatório): Endereço de e-mail único do usuário.
    * `senha` (String, Obrigatório): Senha do usuário.
    * `tipoUsuario` (String, Obrigatório): Tipo de usuário. Valores permitidos: `"Administrador"` ou `"Funcionario"`.
* **Resposta de Sucesso:**
    * **Código:** `201 Created`
    * **Corpo:** Objeto JSON representando o usuário criado, incluindo o `id` gerado pelo sistema.
        ```json
        {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "nome": "Nome do Usuário",
            "email": "usuario@example.com",
            "senha": "senhaDoUsuario123",
            "tipoUsuario": "Administrador"
        }
        ```
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Campos obrigatórios ausentes ou `tipoUsuario` inválido.
        ```json
        {"error": "Campos obrigatórios ausentes: nome"}
        ```
        ```json
        {"error": "tipoUsuario inválido. Deve ser \"Administrador\" ou \"Funcionario\"."}
        ```

---

### 2. Listar Todos os Usuários

* **Método:** `GET`
* **Path:** `/usuarios`
* **Descrição:** Retorna uma lista de todos os usuários cadastrados.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Array JSON contendo os objetos dos usuários.
        ```json
        [
            {
                "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                "nome": "Usuário Um",
                "email": "um@example.com",
                "senha": "senhaUm",
                "tipoUsuario": "Funcionario"
            },
            {
                "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
                "nome": "Usuário Dois",
                "email": "dois@example.com",
                "senha": "senhaDois",
                "tipoUsuario": "Administrador"
            }
        ]
        ```
        * Se não houver usuários, retorna um array vazio `[]`.
* **Respostas de Erro Comuns:**
    * `500 Internal Server Error`: Em caso de falha ao acessar o banco de dados.

---

### 3. Obter Usuário por ID

* **Método:** `GET`
* **Path:** `/usuarios/{id}`
* **Descrição:** Retorna os detalhes de um usuário específico com base no seu ID.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do usuário a ser recuperado.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON com os dados do usuário.
        ```json
        {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "nome": "Usuário Um",
            "email": "um@example.com",
            "senha": "senhaUm",
            "tipoUsuario": "Funcionario"
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o usuário com o ID fornecido não existir.
        ```json
        {"error": "Usuário não encontrado"}
        ```
    * `400 Bad Request`: Se o ID não for fornecido no caminho.

---

### 4. Atualizar Usuário

* **Método:** `PUT`
* **Path:** `/usuarios/{id}`
* **Descrição:** Atualiza os dados de um usuário existente. Apenas os campos fornecidos no corpo da requisição serão atualizados. O `id` não pode ser alterado.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do usuário a ser atualizado.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Novo Nome do Usuário",
        "email": "novousuario@example.com"
    }
    ```
    * Pelo menos um campo válido para atualização deve ser fornecido (`nome`, `email`, `senha`, `tipoUsuario`).
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON contendo todos os atributos do usuário após a atualização (conforme `ReturnValues="UPDATED_NEW"`).
        ```json
        {
            "nome": "Novo Nome do Usuário",
            "email": "novousuario@example.com"
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o usuário com o ID fornecido não existir (se a verificação `ConditionExpression="attribute_exists(id)"` estiver ativa e falhar).
        ```json
        {"error": "Usuário não encontrado para atualização"}
        ```
    * `400 Bad Request`: Se o ID não for fornecido no caminho, o corpo da requisição estiver ausente, ou nenhum campo válido para atualização for fornecido.
        ```json
        {"error": "Nenhum campo válido para atualização fornecido"}
        ```

---

### 5. Deletar Usuário

* **Método:** `DELETE`
* **Path:** `/usuarios/{id}`
* **Descrição:** Remove um usuário do sistema com base no seu ID.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do usuário a ser deletado.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `204 No Content`
    * **Corpo:** Nenhum.
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o usuário com o ID fornecido não existir e a verificação `ConditionExpression="attribute_exists(id)"` estiver ativa e falhar.
        ```json
        {"error": "Usuário não encontrado para deleção"}
        ```
    * `400 Bad Request`: Se o ID não for fornecido no caminho.

---

**Cabeçalhos CORS:**

A API está configurada para retornar os seguintes cabeçalhos de controle de acesso para permitir requisições de diferentes origens (útil para frontends web):
* `Access-Control-Allow-Origin: *` (Permite qualquer origem. Em produção, restrinja isso para seus domínios específicos.)
* `Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
* `Access-Control-Allow-Methods: OPTIONS,POST,GET,PUT,DELETE` (Dependendo da configuração do método `OPTIONS` no API Gateway para o recurso).

---