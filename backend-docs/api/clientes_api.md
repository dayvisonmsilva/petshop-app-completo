# Documentação da API - Recurso: Clientes PetShop

Esta documentação descreve os endpoints para gerenciar os Clientes cadastrados no sistema PetShop.

**URL Base para Clientes:**
`https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes`

Para operações em um cliente específico, anexe o ID do cliente a esta URL base (ex: `/clientes/{idCliente}`).

**Autenticação:**
Atualmente, esta API não requer autenticação.

**Formato dos Dados:**
Todas as requisições e respostas que contêm um corpo (body) utilizam o formato `application/json`.

**Cabeçalhos CORS:**
A API está configurada para retornar cabeçalhos CORS que permitem requisições de diferentes origens (ex: `Access-Control-Allow-Origin: *`). Em produção, restrinja o `Access-Control-Allow-Origin` para seus domínios específicos.

---

## Endpoints de Clientes

### 1. Criar Cliente
* **Método:** `POST`
* **Path:** `/` (relativo à URL Base de Clientes, ou seja, `https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes`)
* **Descrição:** Cadastra um novo cliente no sistema.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Ana Silva",
        "endereco": "Rua das Flores, 123, Bairro Feliz",
        "telefone": "11912345678"
    }
    ```
    * `nome` (String, Obrigatório): Nome completo do cliente.
    * `endereco` (String, Obrigatório): Endereço completo do cliente.
    * `telefone` (String, Obrigatório): Número de telefone do cliente.
* **Resposta de Sucesso:**
    * **Código:** `201 Created`
    * **Corpo:** Objeto JSON representando o cliente criado, incluindo o `id` (UUID String) gerado para o cliente.
        ```json
        {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "nome": "Ana Silva",
            "endereco": "Rua das Flores, 123, Bairro Feliz",
            "telefone": "11912345678"
        }
        ```
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Campos obrigatórios ausentes ou vazios, ou JSON malformado.
        ```json
        {"error": "Campos obrigatórios ausentes ou vazios: nome, endereco, telefone"}
        ```

---

### 2. Listar Todos os Clientes
* **Método:** `GET`
* **Path:** `/` (relativo à URL Base de Clientes, ou seja, `https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes`)
* **Descrição:** Retorna uma lista de todos os clientes cadastrados. (Use com cautela em produção se a lista for muito grande).
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Array JSON contendo os objetos dos clientes. Se não houver clientes, retorna `[]`.
        ```json
        [
            {
                "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                "nome": "Ana Silva",
                "endereco": "Rua das Flores, 123, Bairro Feliz",
                "telefone": "11912345678"
            }
            // ... mais clientes
        ]
        ```
* **Respostas de Erro Comuns:**
    * `500 Internal Server Error`.

---

### 3. Obter Cliente por ID
* **Método:** `GET`
* **Path:** `/{id}` (relativo à URL Base de Clientes, ex: `https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes/{idCliente}`)
* **Descrição:** Retorna os detalhes de um cliente específico com base no seu ID.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do cliente.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON com os dados do cliente.
        ```json
        {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "nome": "Ana Silva",
            "endereco": "Rua das Flores, 123, Bairro Feliz",
            "telefone": "11912345678"
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o cliente com o ID fornecido não existir.
        ```json
        {"error": "Cliente não encontrado"}
        ```
    * `400 Bad Request`: ID ausente no caminho.

---

### 4. Atualizar Cliente
* **Método:** `PUT`
* **Path:** `/{id}` (relativo à URL Base de Clientes, ex: `https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes/{idCliente}`)
* **Descrição:** Atualiza os dados de um cliente existente. Apenas os campos fornecidos no corpo serão atualizados.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do cliente.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "endereco": "Avenida Principal, 789, Centro",
        "telefone": "11988887777"
    }
    ```
    * Pode incluir `nome` (String), `endereco` (String), `telefone` (String). Pelo menos um campo válido e não vazio deve ser fornecido.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON contendo os atributos do cliente que foram atualizados.
        ```json
        {
            // Atributos atualizados
            "endereco": "Avenida Principal, 789, Centro",
            "telefone": "11988887777"
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o cliente com o ID fornecido não existir (devido à `ConditionExpression`).
        ```json
        {"error": "Cliente não encontrado para atualização"}
        ```
    * `400 Bad Request`: ID ausente, corpo ausente, nenhum campo válido, ou valores de campo inválidos (ex: campo vazio).
        ```json
        {"error": "O campo endereco não pode ser vazio se fornecido para atualização"}
        ```

---

### 5. Deletar Cliente
* **Método:** `DELETE`
* **Path:** `/{id}` (relativo à URL Base de Clientes, ex: `https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes/{idCliente}`)
* **Descrição:** Remove um cliente do sistema. (Em um sistema real, considere o que acontece com os pets e agendamentos associados a este cliente - deleção em cascata, anonimização, ou impedir a deleção se houver dependências).
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do cliente.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `204 No Content`
    * **Corpo:** Nenhum.
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o cliente com o ID fornecido não existir (devido à `ConditionExpression`).
        ```json
        {"error": "Cliente não encontrado para deleção"}
        ```
    * `400 Bad Request`: ID ausente no caminho.

---
