# Investe Aí

Front-end project for an investment platform. 

🔗 Access the app:
https://investe-ai-front.vercel.app/

To view data from a specific investor, append the investor ID to the URL.

Example:
https://investe-ai-front.vercel.app/ID
(Replace ID with your actual investor ID)

**Note:** This project was initially developed in a private repository and later made public. As a result, the `.env` file was committed a few times before it was added to `.gitignore`. Since the `.env` file does not contain any sensitive or relevant data, it was not removed from the previous commits.


## 🛠️ Tecnologias Utilizadas
- React
- Axios (requisições HTTP)
- React Router
- Styled Components

### Como rodar o projeto localmente

Pré-requisitos:

- Node.js v18+ instalado
- npm
- Git

---

### Instalação

#### 1. Clone o repositório:

git clone https://github.com/seu-usuario/investe-ai.git
cd frontend

#### 2. Instale as dependências:

npm install

---

### Configuração

#### 3. Crie um arquivo .env na raiz com o seguinte conteúdo (ajuste conforme necessário):

REACT_APP_API_URL=http://localhost:3000

REACT_APP_API_URL: Defina a URL da API (por padrão, para rodar localmente, será http://localhost:3000).

---

### Iniciando o servidor:

#### 4. Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

npm run dev

 - A aplicação estará disponível em: http://localhost:3000 (ou a porta definida pelo Vite)

---

### Estrutura resumida
.
├── public
│   ├── index.html
├── src
│   ├── components
│   │   ├── Header.tsx
│   │   ├── UserCard.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── UserProfile.tsx
│   ├── services
│   │   ├── api.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── setupTests.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── .env.example

---

### Endpoints principais

| Método | Rota        | Descrição                                 |
| ------ | ----------- | ----------------------------------------- |
| POST   | `/`         | Cria ou atualiza um usuário e seus ativos |
| GET    | `/:frontId` | Retorna os dados de um usuário específico |

---

### Notas
A aplicação front-end consome a API do back-end, então é necessário que a API esteja rodando para testar o front-end localmente.

O arquivo .env contém as variáveis de ambiente necessárias para configurar o URL da API e outras informações relevantes.