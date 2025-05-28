# Documentação da API - Recurso: Agendamentos PetShop

Esta documentação descreve os endpoints para gerenciar os Agendamentos no sistema PetShop. Os agendamentos conectam Clientes, Pets, Serviços e Colaboradores.

**URL Base para Agendamentos:**
`https://ba0wpj4u21.execute-api.us-east-1.amazonaws.com/dev/agendamentos`

Para operações em um agendamento específico, anexe o ID do agendamento a esta URL base (ex: `/agendamentos/{idAgendamento}`).

**Autenticação:**
Atualmente, esta API não requer autenticação.

**Formato dos Dados:**
Todas as requisições e respostas que contêm um corpo (body) utilizam o formato `application/json`.

---

## Conceitos Importantes

### Formato de Data e Hora (`dataHora`)

Todas as datas e horas (`dataHora`) devem ser enviadas e serão retornadas no formato **ISO 8601**. Este formato padronizado é crucial para evitar ambiguidades, facilitar a ordenação cronológica e permitir consultas precisas por período.

* **Estrutura:** `YYYY-MM-DDTHH:MM:SS[+/-HH:MM|Z]`
    * `YYYY`: Ano com quatro dígitos (ex: 2025)
    * `MM`: Mês com dois dígitos (01-12)
    * `DD`: Dia com dois dígitos (01-31)
    * `T`: Separador literal entre data e hora.
    * `HH`: Hora com dois dígitos (00-23)
    * `MM`: Minuto com dois dígitos (00-59)
    * `SS`: Segundo com dois dígitos (00-59)
    * `[+/-HH:MM|Z]`: Designador de fuso horário (offset em relação ao UTC) ou 'Z' para UTC (Zulu time).
        * `+HH:MM`: Fuso horário à frente do UTC (ex: `+02:00`).
        * `-HH:MM`: Fuso horário atrás do UTC (ex: `-03:00` para Horário de Brasília Padrão).
        * `Z`: Indica UTC.

* **Exemplos Válidos:**
    * `2025-07-10T14:30:00-03:00` (10 de Julho de 2025, às 14:30, no fuso horário de Brasília - BRT)
    * `2025-07-10T17:30:00Z` (10 de Julho de 2025, às 17:30, em UTC)
    * `2025-12-25T09:00:00+00:00` (Equivalente a `2025-12-25T09:00:00Z`)

Ao criar ou atualizar um agendamento, forneça a `dataHora` neste formato. A API também armazenará internamente um campo derivado `dataAgendamento` (no formato `YYYY-MM-DD`) para otimizar consultas por dia específico.

### Valores de Status do Agendamento (`status`)

O campo `status` indica a situação atual de um agendamento. Ele pode assumir um dos seguintes valores (String, case-insensitive na consulta, mas armazenado em maiúsculas):

* **`AGENDADO`**: Status inicial padrão quando um novo agendamento é criado. Indica que o horário foi reservado.
* **`CONFIRMADO`**: O agendamento foi confirmado pelo cliente ou pelo petshop.
* **`CANCELADO_CLIENTE`**: O agendamento foi cancelado pelo cliente.
* **`CANCELADO_PETSHOP`**: O agendamento foi cancelado pelo petshop.
* **`CONCLUIDO`**: O serviço foi realizado e o agendamento está finalizado.
* **`NAO_COMPARECEU`**: O cliente (e o pet) não compareceram ao agendamento.

Ao atualizar um agendamento, o novo `status` deve ser um desses valores válidos.

---

**Cabeçalhos CORS:**
A API está configurada para retornar cabeçalhos CORS que permitem requisições de diferentes origens (ex: `Access-Control-Allow-Origin: *`). Em produção, restrinja o `Access-Control-Allow-Origin` para seus domínios específicos.

---

## Endpoints de Agendamentos

### 1. Criar Agendamento
* **Método:** `POST`
* **Path:** `/` (relativo à URL Base de Agendamentos)
* **Descrição:** Cria um novo agendamento no sistema.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "clienteId": "uuid-do-cliente-existente",
        "petId": "uuid-do-pet-existente",
        "servicoId": "uuid-do-servico-existente",
        "dataHora": "2025-07-10T10:00:00-03:00",
        "colaboradorAlocado": "Nome do Colaborador"
    }
    ```
    * `clienteId` (String, Obrigatório): ID do Cliente.
    * `petId` (String, Obrigatório): ID do Pet.
    * `servicoId` (String, Obrigatório): ID do Serviço.
    * `dataHora` (String, Obrigatório): Data e hora do agendamento no formato ISO 8601.
    * `colaboradorAlocado` (String, Obrigatório): Nome do funcionário/colaborador responsável.
* **Resposta de Sucesso:**
    * **Código:** `201 Created`
    * **Corpo:** Objeto JSON representando o agendamento criado, incluindo seu `id` (UUID String gerado), `dataAgendamento` (derivado) e `status` inicial (`AGENDADO`).
        ```json
        {
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "clienteId": "uuid-do-cliente-existente",
            "petId": "uuid-do-pet-existente",
            "servicoId": "uuid-do-servico-existente",
            "dataHora": "2025-07-10T10:00:00-03:00",
            "dataAgendamento": "2025-07-10",
            "colaboradorAlocado": "Nome do Colaborador",
            "status": "AGENDADO",
            "createdAt": "timestamp-iso-8601-utc"
        }
        ```
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Campos obrigatórios ausentes, `dataHora` em formato inválido.
        ```json
        {"error": "Campos obrigatórios ausentes ou vazios"}
        ```json
        {"error": "Formato de dataHora inválido. Use ISO 8601 (ex: YYYY-MM-DDTHH:MM:SSZ ou YYYY-MM-DDTHH:MM:SS+/-HH:MM)"}
        ```

---

### 2. Listar Agendamentos (`GET /`)
* **Método:** `GET`
* **Path:** `/` (relativo à URL Base de Agendamentos)
* **Descrição:** Retorna uma lista de agendamentos. A listagem é altamente flexível e pode ser filtrada usando diversos parâmetros de consulta. A API tentará usar o Índice Secundário Global (GSI) mais apropriado com base nos parâmetros fornecidos para otimizar a consulta.
    * Se nenhum parâmetro de filtro principal que utilize um GSI (como `clienteId`, `petId`, `colaboradorAlocado`, `dataAgendamento`) for fornecido, um *scan* da tabela será realizado. Scans podem ser lentos e custosos para tabelas grandes e devem ser evitados em produção sem filtros adicionais ou para casos de uso administrativos com paginação.
    * Filtros como `status`, `dataInicio`, `dataFim` podem ser combinados com os filtros de GSI ou aplicados a um scan.

* **Parâmetros de Consulta (Query Parameters - Opcionais):**
    * `clienteId` (String): Filtra agendamentos pelo ID do cliente.
        * Utiliza o GSI: `ClienteIdDataHoraIndex`.
        * Ex: `?clienteId=uuid-do-cliente`
    * `petId` (String): Filtra agendamentos pelo ID do pet.
        * Utiliza o GSI: `PetIdDataHoraIndex`.
        * Ex: `?petId=uuid-do-pet`
    * `colaboradorAlocado` (String): Filtra agendamentos pelo nome do colaborador.
        * Utiliza o GSI: `ColaboradorAlocadoDataHoraIndex`.
        * Ex: `?colaboradorAlocado=Nome%20do%20Colaborador` (Lembre-se de codificar URLs com espaços: `%20`)
    * `dataAgendamento` (String, formato `YYYY-MM-DD`): Filtra agendamentos para um dia específico.
        * Utiliza o GSI: `DataAgendamentoDataHoraIndex`.
        * Ex: `?dataAgendamento=2025-07-10`
    * `status` (String): Filtra agendamentos pelo status (ex: `AGENDADO`, `CONFIRMADO`).
        * Pode ser combinado com os filtros acima. Se for o único filtro principal e o GSI `StatusDataHoraIndex` estiver configurado e ativo, ele será usado. Caso contrário, será aplicado como um filtro secundário na consulta do GSI ou no scan.
        * Ex: `?status=AGENDADO`
        * Ex: `?clienteId=uuid-do-cliente&status=CONFIRMADO`
    * `dataInicio` (String, formato ISO 8601) e `dataFim` (String, formato ISO 8601): Para filtrar por um intervalo de `dataHora`.
        * Estes são mais eficazes quando usados em conjunto com um filtro que utiliza um GSI cuja chave de classificação é `dataHora` (como `ClienteIdDataHoraIndex`, `PetIdDataHoraIndex`, `ColaboradorAlocadoDataHoraIndex`, `DataAgendamentoDataHoraIndex`, `StatusDataHoraIndex`).
        * A API aplicará uma condição `BETWEEN` na chave de classificação `dataHora` do GSI.
        * Ex: `?clienteId=uuid-do-cliente&dataInicio=2025-07-01T00:00:00-03:00&dataFim=2025-07-31T23:59:59-03:00`
        * Ex: `?dataAgendamento=2025-07-10&dataInicio=2025-07-10T09:00:00-03:00&dataFim=2025-07-10T18:00:00-03:00` (para filtrar horários dentro de um dia específico).

* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Array JSON contendo os objetos dos agendamentos que correspondem aos filtros. Retorna `[]` se nenhum for encontrado.
        ```json
        [
            {
                "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                "clienteId": "uuid-do-cliente-existente",
                // ... demais campos do agendamento
            }
            // ... mais agendamentos
        ]
        ```
* **Respostas de Erro Comuns:**
    * `500 Internal Server Error`: Ex: Se um nome de índice configurado na Lambda não existir no DynamoDB, ou outro erro interno.
    * `400 Bad Request`: Se os formatos de `dataInicio` ou `dataFim` forem inválidos.

---

### 3. Obter Agendamento por ID (`GET /{id}`)
* **Método:** `GET`
* **Path:** `/{id}` (ex: `/agendamentos/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)
* **Descrição:** Retorna os detalhes de um agendamento específico com base no seu ID único.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do agendamento.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON com os dados do agendamento.
        ```json
        {
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "clienteId": "uuid-do-cliente-existente",
            "petId": "uuid-do-pet-existente",
            "servicoId": "uuid-do-servico-existente",
            "dataHora": "2025-07-10T10:00:00-03:00",
            "dataAgendamento": "2025-07-10",
            "colaboradorAlocado": "Nome do Colaborador",
            "status": "AGENDADO",
            "createdAt": "timestamp-iso-8601-utc",
            "updatedAt": "timestamp-iso-8601-utc" // se já foi atualizado
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o agendamento com o ID fornecido não existir.
        ```json
        {"error": "Agendamento não encontrado"}
        ```
    * `400 Bad Request`: ID ausente no caminho.

---

### 4. Atualizar Agendamento
* **Método:** `PUT`
* **Path:** `/{id}` (ex: `/agendamentos/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)
* **Descrição:** Atualiza dados de um agendamento existente. Campos permitidos para atualização: `dataHora`, `status`, `colaboradorAlocado`. Se `dataHora` for alterada, o campo `dataAgendamento` também será recalculado e atualizado.
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do agendamento.
* **Corpo da Requisição (`application/json`):**
    ```json
    {
        "dataHora": "2025-07-10T11:00:00-03:00",
        "status": "CONFIRMADO",
        "colaboradorAlocado": "Novo Nome Colaborador"
    }
    ```
    * Forneça apenas os campos que deseja alterar.
* **Resposta de Sucesso:**
    * **Código:** `200 OK`
    * **Corpo:** Objeto JSON contendo todos os atributos do agendamento após a atualização.
        ```json
        {
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "dataHora": "2025-07-10T11:00:00-03:00",
            "dataAgendamento": "2025-07-10",
            "status": "CONFIRMADO",
            "colaboradorAlocado": "Novo Nome Colaborador",
            "updatedAt": "novo-timestamp-iso-8601-utc"
            // ... demais campos do agendamento
        }
        ```
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o agendamento com o ID fornecido não existir (devido à `ConditionExpression`).
        ```json
        {"error": "Agendamento não encontrado para atualização"}
        ```
    * `400 Bad Request`: ID ausente, corpo ausente, nenhum campo válido para atualização, `dataHora` em formato inválido, ou `status` inválido.
        ```json
        {"error": "Status inválido. Válidos: AGENDADO, CONFIRMADO, ..."}
        ```

---

### 5. Deletar Agendamento
* **Método:** `DELETE`
* **Path:** `/{id}` (ex: `/agendamentos/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)
* **Descrição:** Remove um agendamento do sistema (hard delete).
* **Parâmetros de Caminho:**
    * `id` (String, Obrigatório): O ID (UUID) do agendamento.
* **Corpo da Requisição:** Nenhum.
* **Resposta de Sucesso:**
    * **Código:** `204 No Content`
    * **Corpo:** Nenhum.
* **Respostas de Erro Comuns:**
    * `404 Not Found`: Se o agendamento com o ID fornecido não existir (devido à `ConditionExpression`).
        ```json
        {"error": "Agendamento não encontrado para deleção"}
        ```
    * `400 Bad Request`: ID ausente no caminho.

---
