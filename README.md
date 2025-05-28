# Task Manager API

API RESTful para gerenciamento de tarefas com autenticação via JWT. Desenvolvido com NestJS e Prisma ORM.

## 🔧 Tecnologias
- NestJS
- Prisma ORM
- PostgreSQL
- JWT e Bcrypt

## 🚀 Como rodar localmente

### Pré-requisitos:
- Node.js
- Docker (opcional, mas recomendado para banco)
- PostgreSQL

### Instalação

```bash
git clone https://github.com/seu-usuario/task-manager-api.git
cd task-manager-api
npm install
Configuração do banco
Crie um .env com:
ini
CopiarEditar
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskmanager"
JWT_SECRET="sua_chave_secreta"
Prisma
bash
CopiarEditar
npx prisma migrate dev --name init
npx prisma generate
Start
bash
CopiarEditar
npm run start:dev
Endpoints principais
    • POST /auth/register
    • POST /auth/login
    • GET /tasks (protegido)
📦 Deploy
Recomendado: Railway
yaml
CopiarEditar
