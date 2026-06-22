# shadow-dark-character-sheet

Ficha de personagem do Shadow Dark (React 19 + Vite + Chakra UI v3), com persistência na
nuvem via **Supabase** e deploy do frontend na **Vercel**.

## Arquitetura

- **Frontend**: SPA em Vite. A UI não conhece o backend diretamente — fala com uma camada de
  persistência (`src/repositories/characterRepository.ts`) e com o client em `src/lib/supabase.ts`.
- **Auth**: login anônimo do Supabase (`signInAnonymously`). Cada navegador recebe um usuário
  anônimo persistente; os dados ficam isolados por usuário via RLS. Sem contas — limpar o storage
  do navegador ou trocar de dispositivo significa começar do zero.
- **Dados**: tabela `public.characters` (uma linha por ficha, o `Character` inteiro em `jsonb`).
- **Avatares**: bucket `avatars` no Supabase Storage; guardamos só a URL pública no personagem.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Desenvolvimento

```bash
npm install
npm run dev
```

### Supabase local (opcional, recomendado)

Requer a [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
supabase start          # sobe Postgres + Auth + Storage locais e aplica as migrations
```

Use a URL/anon key impressas pelo `supabase start` no seu `.env.local`. O Studio local fica em
http://localhost:54323.

### Supabase em nuvem

1. Crie um projeto em https://supabase.com.
2. Aplique a migration `supabase/migrations/` (via `supabase db push` após `supabase link`, ou
   colando o SQL no SQL Editor).
3. Em Authentication → Providers, habilite **Anonymous sign-ins**.
4. Pegue a URL e a `anon key` em Project Settings → API e coloque no `.env.local`.

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Vite; build `npm run build`, output `dist`).
2. Em Settings → Environment Variables, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. Em Supabase → Authentication → URL Configuration, adicione o domínio da Vercel às URLs
   permitidas.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — type-check + build de produção
- `npm run preview` — pré-visualiza o build
- `npm run lint` — ESLint
