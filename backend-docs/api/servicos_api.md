# Documentação da API - Recurso: Serviços PetShop

Esta documentação descreve os endpoints para gerenciar os Serviços oferecidos pelo PetShop.

**URL Base para Serviços:**
`https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos`

Para operações em um serviço específico, anexe o ID do serviço a esta URL base (ex: `/servicos/{id}`).

**Autenticação:**
Atualmente, esta API não requer autenticação.

**Formato dos Dados:**
Todas as requisições e respostas que contêm um corpo (body) utilizam o formato `application/json`.

**Cabeçalhos CORS:**
A API está configurada para retornar cabeçalhos CORS que permitem requisições de diferentes origens (ex: `Access-Control-Allow-Origin: *`). Em produção, restrinja o `Access-Control-Allow-Origin` para seus domínios específicos.

---

## Endpoints de Serviços

### 1. Criar Serviço
* **Método:** `POST`
* **Path:** `/` (relativo à URL Base de Serviços, ou seja, `https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos`)
* **Descrição:** Cria um novo serviço.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Tosa Higiênica",
        "duracao": 60,
        "valor": 75.50
    }
    ```
    * `nome` (String, Obrigatório): Nome do serviço.
    * `duracao` (Integer, Obrigatório): Duração do serviço em minutos (deve ser positivo).
    * `valor` (Number, Obrigatório): Preço do serviço (deve ser positivo).
* **Resposta de Sucesso:**
    * **Código:** `201 Created`
    * **Corpo:** Objeto JSON representando o serviço criado, incluindo o `id` (UUID String) gerado.
        ```json
        {
            "id": "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
            "nome": "Tosa Higiênica",
            "duracao": 60,
            "valor": 75.50 
        }
        ```
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Campos obrigatórios ausentes, `duracao` ou `valor` inválidos (não positivos ou tipo incorreto), ou JSON malformado.

---

### 2. Listar Todos os Serviços
* **Método:** `GET`
* **Path:** `/` (relativo à URL Base de Serviços, ou seja, `https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos`)
* **Descrição:** Retorna uma lista de todos os serviços cadastrados.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Array JSON contendo os objetos dos serviços. Se não houver serviços, retorna `[]`.
        ```json
        [
            {
                "id": "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
                "nome": "Tosa Higiênica",
                "duracao": 60,
                "valor": 75.50
            }
            // ... mais serviços
        ]
        ```
* **Respostas de Erro Comuns:**
    * `500 Internal Server Error`.

---

### 3. Obter Serviço por ID
* **Método:** `GET`
* **Path:** `/{id}` (relativo à URL Base de Serviços, ex: `https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos/{id}`)
* **Descrição:** Retorna os detalhes de um serviço específico.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do serviço.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON com os dados do serviço.
        ```json
        {
            "id": "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
            "nome": "Tosa Higiênica",
            "duracao": 60,
            "valor": 75.50
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o serviço com o ID fornecido não existir.
    * `400 Bad Request`: ID ausente no caminho.

---

### 4. Atualizar Serviço
* **Método:** `PUT`
* **Path:** `/{id}` (relativo à URL Base de Serviços, ex: `https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos/{id}`)
* **Descrição:** Atualiza os dados de um serviço existente. Apenas os campos fornecidos no corpo serão atualizados.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do serviço.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "nome": "Tosa Higiênica Avançada",
        "valor": 85.00
    }
    ```
    * Pode incluir `nome` (String), `duracao` (Integer, positivo), `valor` (Number, positivo). Pelo menos um campo válido deve ser fornecido.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON contendo os atributos do serviço que foram atualizados.
        ```json
        {
            // Atributos atualizados
            "nome": "Tosa Higiênica Avançada",
            "valor": 85.00
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o serviço com o ID fornecido não existir (devido à `ConditionExpression`).
    * `400 Bad Request`: ID ausente, corpo ausente, nenhum campo válido, ou valores de campo inválidos.

---

### 5. Deletar Serviço
* **Método:** `DELETE`
* **Path:** `/{id}` (relativo à URL Base de Serviços, ex: `https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos/{id}`)
* **Descrição:** Remove um serviço do sistema.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do serviço.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `204 No Content`
    * **Corpo:** Nenhum.
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o serviço com o ID fornecido não existir (devido à `ConditionExpression`).
    * `400 Bad Request`: ID ausente no caminho.

---