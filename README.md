# Portfólio Anny + Painel Administrativo

Projeto completo de portfólio profissional com painel administrativo, autenticação, cadastro de projetos, upload de imagens e integração com Supabase.

O projeto foi preparado para ser publicado como uma única aplicação na Vercel.

## Estrutura de rotas

```text
/          → Portfólio público
/login     → Login administrativo
/admin     → Painel de gerenciamento de projetos
```

A página principal exibe o portfólio original armazenado em:

```text
public/portfolio.html
```

O arquivo `vercel.json` direciona a rota principal `/` para esse portfólio:

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/portfolio.html"
    }
  ]
}
```

As rotas `/login` e `/admin` são geradas pelo Next.js por meio do App Router:

```text
app/
├── admin/
│   └── page.tsx
├── login/
│   └── page.tsx
├── globals.css
└── layout.tsx
```

---

# Funcionalidades

## Portfólio público

- apresentação profissional dos serviços;
- versão clara e escura;
- layout responsivo;
- seção de projetos;
- filtros gerados a partir das categorias cadastradas;
- carrossel de projetos;
- link para visualizar os sites publicados;
- contato pelo WhatsApp;
- carregamento automático dos projetos cadastrados no Supabase.

## Painel administrativo

- login com Supabase Auth;
- acesso restrito para administradores;
- cadastro de novos projetos;
- edição de projetos;
- exclusão de projetos;
- publicação e ocultação;
- definição de projetos em destaque;
- organização pela ordem de exibição;
- upload de imagens para o Supabase Storage;
- gerenciamento sem necessidade de editar o código.

---

# Funcionamento da integração

O fluxo de dados funciona assim:

```text
Painel administrativo
        ↓
Supabase
        ↓
Tabela projects
        ↓
Portfólio público
```

Ao cadastrar ou editar um projeto no painel, as informações são armazenadas no Supabase.

O portfólio consulta os projetos publicados e os exibe automaticamente.

Somente projetos com:

```text
published = true
```

são exibidos publicamente.

A posição dos projetos é definida pelo campo:

```text
display_order
```

Quanto menor o número, mais cedo o projeto aparece.

Exemplo:

```text
0 → primeiro projeto
1 → segundo projeto
2 → terceiro projeto
```

---

# Tecnologias utilizadas

- Next.js 15
- React
- TypeScript
- Supabase
- Supabase Auth
- Supabase Database
- Supabase Storage
- Vercel
- GitHub
- Lucide React

---

# Variáveis de ambiente

Crie um arquivo chamado:

```text
.env.local
```

na mesma pasta do `package.json`.

Use a seguinte estrutura:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO
NEXT_PUBLIC_SITE_URL=https://seu-site.vercel.app
```

## Descrição das variáveis

### `NEXT_PUBLIC_SUPABASE_URL`

URL base do projeto Supabase.

Exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://exemplo.supabase.co
```

Não adicione:

```text
/rest/v1/
```

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Chave pública ou `publishable key` do Supabase.

Nunca use no frontend:

```text
service_role
secret key
```

### `NEXT_PUBLIC_WHATSAPP_NUMBER`

Número do WhatsApp com código do país e DDD, somente com números.

Exemplo:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5562999999999
```

### `NEXT_PUBLIC_SITE_URL`

Endereço público do portfólio.

Exemplo:

```env
NEXT_PUBLIC_SITE_URL=https://portfoliosolucoesanny.vercel.app
```

## Segurança

Nunca envie o arquivo `.env.local` para o GitHub.

O `.gitignore` deve conter:

```gitignore
node_modules
.next
.env
.env.local
.env.production
.vercel
*.log
```

---

# Instalação local

Clone o repositório:

```bash
git clone https://github.com/annygabb/VendasPortfolio.git
```

Entre na pasta:

```bash
cd VendasPortfolio
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` e configure as variáveis de ambiente.

Inicie o projeto:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/admin
```

---

# Comandos disponíveis

## Desenvolvimento

```bash
npm run dev
```

## Compilação

```bash
npm run build
```

## Executar a versão compilada

```bash
npm run start
```

---

# Configuração do Supabase

O projeto utiliza:

```text
public.projects
public.admins
storage bucket project-images
```

## Tabela `projects`

Campos principais:

```text
id
title
slug
category
short_description
result_description
image_url
live_url
status
featured
published
display_order
created_at
updated_at
```

## Status disponíveis

```text
online
desenvolvimento
demonstracao
```

## Administradores

O usuário precisa existir em:

```text
Supabase Authentication → Users
```

E o ID desse usuário precisa estar cadastrado em:

```text
public.admins
```

Sem esse cadastro, o usuário poderá autenticar, mas não terá permissão para gerenciar os projetos.

---

# Publicação na Vercel

## 1. Conectar o repositório

Na Vercel:

```text
Add New
→ Project
→ Import Git Repository
```

Selecione:

```text
annygabb/VendasPortfolio
```

## 2. Configurar as variáveis

Na Vercel, abra:

```text
Project Settings
→ Environment Variables
```

Cadastre:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_SITE_URL
```

Selecione os ambientes:

```text
Production
Preview
```

Depois de criar ou alterar variáveis, é necessário fazer um novo deploy.

---

# Configuração obrigatória do Next.js na Vercel

Este projeto precisa ser publicado pela Vercel como uma aplicação Next.js.

Na Vercel, abra:

```text
Project Settings
→ Build and Deployment
```

Em `Framework Preset`, selecione:

```text
Next.js
```

Não deixe como:

```text
Other
```

Caso o framework fique como `Other`, a Vercel poderá publicar apenas os arquivos estáticos da pasta `public`.

Nesse cenário:

```text
/portfolio.html
```

pode funcionar, mas as rotas:

```text
/login
/admin
```

retornarão erro `404 NOT_FOUND`.

## Configuração correta

```text
Framework Preset: Next.js
Build Command: automático
Output Directory: padrão do Next.js
Install Command: automático
Development Command: next
```

Mantenha os botões `Override` desativados.

Não configure manualmente o `Output Directory` como:

```text
public
.next
out
app
```

O diretório de saída deve permanecer no padrão do Next.js.

---

# Fazer novo deploy após alterar o framework

Depois de selecionar `Next.js`, vá em:

```text
Deployments
```

No deployment mais recente:

```text
⋯
→ Redeploy
```

Quando possível, faça o redeploy sem reutilizar o cache antigo.

O novo deployment precisa usar as configurações atuais do projeto.

---

# Verificar as rotas nos logs da Vercel

Abra:

```text
Deployments
→ Deployment mais recente
→ Deployment
→ Deploy Logs
```

No final dos logs, o Next.js deve listar as rotas:

```text
Route (app)
├ ○ /login
└ ƒ /admin
```

Os símbolos podem variar:

```text
○ → rota estática
ƒ → rota dinâmica
```

Se `/login` e `/admin` aparecem nos logs, o Next.js reconheceu as páginas.

---

# Problemas comuns

## `/portfolio.html` funciona, mas `/login` retorna 404

Verifique:

```text
Framework Preset: Next.js
```

Não deixe como `Other`.

Também confirme:

```text
Output Directory: padrão do Next.js
```

Depois faça um novo deploy.

## Erro `MIDDLEWARE_INVOCATION_FAILED`

Caso apareça:

```text
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
```

Verifique o arquivo:

```text
middleware.ts
```

Este projeto pode funcionar sem middleware, pois a página administrativa já valida a sessão e o administrador no servidor.

## Variáveis não carregadas

Depois de alterar o `.env.local`, reinicie o servidor:

```bash
Ctrl + C
npm run dev
```

Depois de alterar variáveis na Vercel, faça um novo deployment.

## Login não funciona

Confirme:

- usuário criado em `Authentication → Users`;
- e-mail e senha corretos;
- usuário confirmado;
- `user_id` cadastrado na tabela `public.admins`;
- URL e chave pública pertencem ao mesmo projeto Supabase.

## Projeto não aparece no portfólio

Confirme no painel ou Supabase:

```text
published = true
```

Verifique também:

```text
display_order
category
image_url
live_url
```

Depois atualize a página com:

```text
Ctrl + F5
```

---

# Endereços de produção

Portfólio:

```text
https://portfoliosolucoesanny.vercel.app/
```

Login:

```text
https://portfoliosolucoesanny.vercel.app/login
```

Painel administrativo:

```text
https://portfoliosolucoesanny.vercel.app/admin
```

---

# Atualização do projeto

Depois de realizar alterações:

```bash
git status
git add .
git commit -m "Descrição da alteração"
git push origin main
```

A Vercel criará um novo deployment automaticamente.

---

# Estrutura principal

```text
VendasPortfolio/
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── AdminDashboard.tsx
│   ├── ProjectCard.tsx
│   └── ProjectGallery.tsx
├── lib/
│   ├── supabase-browser.ts
│   └── supabase-server.ts
├── public/
│   └── portfolio.html
├── supabase/
│   └── schema.sql
├── types/
│   └── project.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── vercel.json
```

---

# Autora

Desenvolvido por **Anny Gabrielly**.

Sites profissionais, sistemas personalizados e manutenção para empresas de diferentes tamanhos e segmentos.
