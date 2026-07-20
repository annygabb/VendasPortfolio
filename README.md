# Portfólio Anny + Painel Administrativo

Projeto único para publicação na Vercel:

- `/` exibe o portfólio original armazenado em `public/portfolio.html`;
- `/login` abre o login administrativo;
- `/admin` abre o painel de projetos;
- projetos publicados no painel são salvos no Supabase e carregados automaticamente na seção de projetos do portfólio.

## Variáveis de ambiente

Crie `.env.local` no desenvolvimento e configure as mesmas variáveis na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO
NEXT_PUBLIC_SITE_URL=https://seu-site.vercel.app
```

Nunca envie `.env.local` ao GitHub.

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse:

- `http://localhost:3000/`
- `http://localhost:3000/login`
- `http://localhost:3000/admin`

## Publicação

Conecte o repositório à Vercel, cadastre as variáveis de ambiente e faça um novo deploy.
