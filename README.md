# Projeto de Demonstração - Node.js com Prisma ORM

Este é um projeto de demonstração usando Node.js com Prisma ORM aula de DFS 2026.1

## Como rodar o projeto

1. Clone o repositório.

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com a variável `DATABASE_URL` apontando para seu banco de dados:

```env
DATABASE_URL="sua_string_de_conexao"
```

4. Execute as migrations:

```bash
npx prisma migrate dev
```

5. Inicie o projeto:

```bash
npm start
```