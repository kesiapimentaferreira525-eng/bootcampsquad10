# Projeto do Curso DFS-2026.1

Este é um projeto de backend desenvolvido em Node.js/Express com Prisma ORM e Postgres 15, para gerenciar ofertas de conhecimentos.

## Como rodar o projeto

1. Clone o repositório no GitHub:

```bash
git clone https://github.com/kesiapimentaferreira525-eng/bootcampsquad10
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo .env na raiz do projeto com a variável DATABASE_URL apontando para o banco de dados:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5433/db_dados?schema=public"
```

4. Execute as migrations:

```bash
npx prisma migrate dev
```

5. Visualizar as tabelas:

```bash
npx prisma studio
```

6. Inicie o projeto:

```bash
npm start
```
