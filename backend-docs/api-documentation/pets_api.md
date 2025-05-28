# Documentação da API - Recurso: Pets PetShop

Esta documentação descreve os endpoints para gerenciar os Pets cadastrados no sistema PetShop.

**URL Base para Pets:**
`https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets`

Para operações em um pet específico, anexe o ID do pet a esta URL base (ex: `/pets/{idPet}`). Para listar pets de um cliente específico, use um parâmetro de consulta.

**Autenticação:**
Atualmente, esta API não requer autenticação.

**Formato dos Dados:**
Todas as requisições e respostas que contêm um corpo (body) utilizam o formato `application/json`.

**Cabeçalhos CORS:**
A API está configurada para retornar cabeçalhos CORS que permitem requisições de diferentes origens (ex: `Access-Control-Allow-Origin: *`). Em produção, restrinja o `Access-Control-Allow-Origin` para seus domínios específicos.

---

## Endpoints de Pets

### 1. Criar Pet
* **Método:** `POST`
* **Path:** `/` (relativo à URL Base de Pets, ou seja, `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets`)
* **Descrição:** Cadastra um novo pet no sistema, associado a um cliente existente.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Rex",
        "idade": 2,
        "raca": "Labrador",
        "clienteId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
    }
    ```
    * `nome` (String, Obrigatório): Nome do pet.
    * `idade` (Integer, Obrigatório): Idade do pet (não pode ser negativa).
    * `raca` (String, Obrigatório): Raça do pet.
    * `clienteId` (String, Obrigatório): O ID (UUID) do cliente (dono) ao qual o pet pertence.
* **Resposta de Sucesso:**
    * **Código:** `201 Created`
    * **Corpo:** Objeto JSON representando o pet criado, incluindo o `id` (UUID String) gerado para o pet.
        ```json
        {
            "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy", 
            "nome": "Rex",
            "idade": 2,
            "raca": "Labrador",
            "clienteId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
        ```
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Campos obrigatórios ausentes ou vazios, `idade` inválida, ou JSON malformado.
        ```json
        {"error": "Campos obrigatórios ausentes ou vazios: nome, idade, raca, clienteId"}
        ```json
        {"error": "Idade não pode ser negativa"}
        ```

---

### 2. Listar Pets
Este endpoint pode ser usado de duas formas: para listar todos os pets (uso administrativo) ou para listar pets de um cliente específico.

* **Método:** `GET`
* **Path:** `/` (relativo à URL Base de Pets, ou seja, `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets`)
* **Descrição:**
    * Se nenhum parâmetro de consulta for fornecido, retorna uma lista de todos os pets cadastrados. (Use com cautela em produção se a lista for muito grande).
    * Se o parâmetro de consulta `clienteId` for fornecido, retorna uma lista de pets pertencentes ao cliente especificado.
* **Parâmetros de Consulta (Query Parameters):**
    * `clienteId` (String, Opcional): O ID (UUID) do cliente para filtrar os pets.
      * Exemplo de URL para filtrar: `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets?clienteId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Array JSON contendo os objetos dos pets. Se não houver pets, retorna `[]`.
        ```json
        // Exemplo para /pets?clienteId=xxxxx
        [
            {
                "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
                "nome": "Rex",
                "idade": 2,
                "raca": "Labrador",
                "clienteId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
            // ... mais pets do mesmo cliente
        ]
        ```json
        // Exemplo para /pets (todos os pets)
        [
            {
                "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
                "nome": "Rex",
                "idade": 2,
                "raca": "Labrador",
                "clienteId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            },
            {
                "id": "wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww",
                "nome": "Mimi",
                "idade": 5,
                "raca": "Siamês",
                "clienteId": "qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq"
            }
        ]
        ```
* **Respostas de Erro Comuns:**
    * `500 Internal Server Error`: Se o índice `PETS_BY_CLIENT_ID_INDEX` não estiver configurado corretamente na Lambda ao tentar filtrar por `clienteId`.
        ```json
        {"error": "Índice de cliente não configurado"}
        ```

---

### 3. Obter Pet por ID
* **Método:** `GET`
* **Path:** `/{id}` (relativo à URL Base de Pets, ex: `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets/{idPet}`)
* **Descrição:** Retorna os detalhes de um pet específico com base no seu ID.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do pet.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON com os dados do pet.
        ```json
        {
            "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
            "nome": "Rex",
            "idade": 2,
            "raca": "Labrador",
            "clienteId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o pet com o ID fornecido não existir.
        ```json
        {"error": "Pet não encontrado"}
        ```
    * `400 Bad Request`: ID ausente no caminho.

---

### 4. Atualizar Pet
* **Método:** `PUT`
* **Path:** `/{id}` (relativo à URL Base de Pets, ex: `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets/{idPet}`)
* **Descrição:** Atualiza os dados de um pet existente. Apenas os campos fornecidos no corpo serão atualizados. O `clienteId` não pode ser alterado por este endpoint.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do pet.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Rex Esperto",
        "idade": 3 
    }
    ```
    * Pode incluir `nome` (String), `idade` (Integer, não negativo), `raca` (String). Pelo menos um campo válido deve ser fornecido.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON contendo os atributos do pet que foram atualizados.
        ```json
        {
            "nome": "Rex Esperto",
            "idade": 3
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o pet com o ID fornecido não existir (devido à `ConditionExpression`).
        ```json
        {"error": "Pet não encontrado para atualização"}
        ```
    * `400 Bad Request`: ID ausente, corpo ausente, nenhum campo válido, ou valores de campo inválidos (ex: idade negativa, campo vazio).

---

### 5. Deletar Pet
* **Método:** `DELETE`
* **Path:** `/{id}` (relativo à URL Base de Pets, ex: `https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets/{idPet}`)
* **Descrição:** Remove um pet do sistema.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do pet.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `204 No Content`
    * **Corpo:** Nenhum.
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o pet com o ID fornecido não existir (devido à `ConditionExpression`).
        ```json
        {"error": "Pet não encontrado para deleção"}
        ```
    * `400 Bad Request`: ID ausente no caminho.

---
