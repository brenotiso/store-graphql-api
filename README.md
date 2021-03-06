# Uma API GraphQL simples, utilizando NestJs e TypeORM

## Descrição

Para a construção da API GraphQL foi utilizado TypeScript, NestJs e TypeOrm, que juntos funcionam muito bem. A estrutura utilizada foi a de [módulos](https://docs.nestjs.com/modules) proposta pelo NestJs, onde cada um dos módulo contém, e pode expor, seus resolvers, services, entidades, repositories e, se necessário, providers diversos. Para a construção do schema e da base de dados foi utilizado o conceito de code-first das entidades, onde o TypeOrm gera as migrations e o NestJs constrói o shema.gql.

## Executando a aplicação 

### Com [Docker](https://docs.docker.com/get-docker/)
```bash
# --build caso seja necessário rebuildar a imagem
$ docker-compose up --build
```
A aplicação estará disponível em [localhost:3000](http://localhost:3000/graphql/)

### Sem Docker

#### Instalação

```bash
# instala as dependências
$ yarn install

# executa as migrations para criar/atualizar a base de dados
$ yarn typeorm migration:run
```

#### Execução
```bash
# desenvolvimento
$ yarn start

# hot reload
$ yarn start:dev

# modo produção
$ yarn start:prod
```

A aplicação estará disponível em [localhost:3000](http://localhost:3000/graphql/)

## Testes

```bash
# Executa os testes unitários
$ yarn test

# Cobertura do testes unitários (o resultado será gerado em coverage/lcov-report/index.html)
$ yarn test:cov

# Executa os testes e2e
$ yarn test:e2e
```
