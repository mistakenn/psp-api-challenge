# psp-challenge

API RESTful criada com NodeJS + Express que funciona como uma versão super simplificada de um Payment Service Provider (PSP).

## Sobre este projeto

Este é um desafio de backend para um processo seletivo, críticas e sugestões são sempre bem-vindas. :P

Fico disponível para contato pelo meu email (abner.figueiredo.bertelline@gmail.com) e/ou [LinkedIn](https://www.linkedin.com/in/abner-figueiredo-bertelline/).

## Começando

### Pré-requisitos

Para executar este projeto você precisará ter um ambiente básico com o NodeJS 10+ e PostgreSQL 10+ instalados.

### Configurando o ambiente

**Criando os bancos de dados**

```
$ psql -U <your_user> -W
$ Password: <your_password>
$ <your_user>=# CREATE DATABASE psp_challenge;
$ <your_user>=# CREATE DATABASE psp_challenge_test;
$ \q
```
_Você pode alterar os nomes dos bancos se desejar, basta mudar no arquivo .env depois ;)_

**Instalando as dependências**

```
$ yarn
```
```
$ npm install
```

**Rodando as migrations**

```
$ yarn knex migrate:latest
```
```
$ npm run knex migrate:latest
```
> Nota: Você pode rodar yarn ```yarn knex migrate:rollback``` ou ```npm run knex migrate:rollback``` para dar rollback nas migrations.

**Configurando o .env**

Crie um arquivo _.env_ na raiz do projeto para manter as variáveis de ambiente, seguindo o padrão apresentado no arquivo _.env.example_. Não esqueça de colocar seu usuário e senha do PostgreSQL para que a aplicação consiga se conectar. :)

### Executando o ambiente de desenvolvimento

```
$ yarn dev
```
```
$ npm run dev
```

### Executar os Testes

```
$ yarn test
```
```
$ npm run test
```

## Rotas

**Base**

URL base da API: http://localhost:8000/api
> __data__: Dados retornados <br/><br/>
__error__: Flag de ocorrência de erro <br/><br/>
__message__: Mensagem indicando sucesso ou o erro

<br/>

_Exemplo de corpo do retorno_
```javascript
{
  "data": null,
  "error": false,
  "message": "PSP Challenge API"
}
```

**Processamento de transações**

POST em http://localhost:8000/api/transaction

> __value__ (number): Valor da transação <br/><br/>
__description__ (string): Descrição da transação <br/><br/>
__paymentMethod__ (```debit_card``` ou ```credit_card```): Método de pagamento <br/><br/>
__card__ (object): Dados do cartão <br/>
>> __number__ (string): Número do cartão <br/><br/>
__owner__ (string): Nome do portador do cartão <br/><br/>
__expiration__ (string): Data de validade do cartão no formato MM/YYYY <br/><br/>
__cvv__ (string): Código de verificação do cartão

<br/>

_Exemplo de corpo da requisição_
```javascript
{
  "value": 100,
  "description": "Smartband XYZ 3.0",
  "paymentMethod": "debit_card",
  "card": {
    "number": "5168441223630339",
    "owner": "Abner Bertelline",
    "expiration": "13/2089",
    "cvv": "209"
  }
}
```

_Exemplo de dados retornados_
```javascript
{
  "id": 10
}
```

**Listagem das transações já realizadas**

GET em http://localhost:8000/api/transaction

> __page__ (number): Número da página <br/><br/>
__pageSize__ (string): Número de resultados por página <br/><br/>
__includeTotal__ (boolean): Flag indicando se deve retornar o número total de transações

<br/>

_Exemplo de QueryString da requisição_
```
?page=2&pageSize=1&includeTotal=true
```

_Exemplo de dados retornados_
```javascript
[
  {
    "id": 2,
    "cardLastDigits": "0339",
    "description": "Smartband XYZ 3.0",
    "value": 235.43,
    "paymentMethod": "credit_card",
    "createdAt": "2019-11-19T04:26:19.738Z"
  }
]
```

**Consulta de saldo**

GET em http://localhost:8000/api/balance

_Exemplo de dados retornados_
```javascript
{
  "available": 1135.74,
  "waiting_funds": 922.32
}
```
