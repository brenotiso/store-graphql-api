# Uma API GraphQL simples, utilizando NestJs e TypeORM

## Descrição

Para a construção da API GraphQL foi utilizado TypeScript, NestJs e TypeOrm, que juntos funcionam muito bem. A estrutura utilizada foia a de [módulos](https://docs.nestjs.com/modules) porposta pelo NestJs, onde cada um dos módulo contém, e pode expor, seus resolvers, services, entidades, repositories e, se necessário, providers diversos.

## Executando a aplicação com [Docker](https://docs.docker.com/get-docker/)
```bash
# --build caso seja necessário rebuildar a imagem
$ docker-compose up --build
```
A aplicação estará disponivel em [localhost:3000](http://localhost:3000/graphql/)

## Executando a aplicação local

### Instalação

```bash
# instala as dependências
$ yarn install

# executa as migrations para criar/atualizar a base de dados
$ yarn typeorm migration:run
```

### Execução
```bash
# desenvolvimento
$ yarn run start

# hot reload
$ yarn run start:dev

# modo produção
$ yarn run start:prod
```

A aplicação estará disponivel em [localhost:3000](http://localhost:3000/graphql/)

## Testes

```bash
# Testes unitário
$ yarn run test

# Cobertura do testes unitário (o resultado será gerado em coverage/lcov-report/index.html)
$ yarn run test:cov

# Testes e2e
$ yarn run test:e2e
```
