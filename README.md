# Portfólio Anny com painel administrativo

Projeto completo em Next.js + Supabase para cadastrar projetos sem editar código. O site público lê o banco em tempo real; alterações feitas no painel `/admin` aparecem automaticamente.

## 1. Criar o Supabase
1. Crie um projeto em supabase.com.
2. Abra **SQL Editor**, cole `supabase/schema.sql` e execute.
3. Em **Authentication > Users**, crie seu usuário com e-mail e senha.
4. Copie o UUID do usuário.
5. No SQL Editor, execute:
   `insert into public.admins(user_id) values ('SEU-UUID');`

## 2. Configurar o projeto
1. Copie `.env.example` para `.env.local`.
2. No Supabase, abra **Project Settings > API**.
3. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Ajuste seu WhatsApp em `NEXT_PUBLIC_WHATSAPP_NUMBER` (somente números, com 55).

## 3. Rodar localmente
```bash
npm install
npm run dev
```
Abra `http://localhost:3000` e acesse `/login`.

## 4. Publicar na Vercel
1. Envie esta pasta para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Em **Settings > Environment Variables**, adicione as mesmas variáveis do `.env.local`.
4. Faça o deploy.

## Funcionamento
- `/`: portfólio público.
- `/login`: login administrativo.
- `/admin`: cadastro, edição, publicação, destaque e exclusão.
- Imagens: bucket público `project-images` no Supabase Storage.
- Segurança: somente UUIDs presentes na tabela `admins` podem alterar dados.
