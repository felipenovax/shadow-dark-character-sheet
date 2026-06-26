# PR — Ficha de Shadow Dark: nuvem, aventuras, inventário e consumíveis

Este PR transforma a ficha de personagem de um app local (localStorage) em uma aplicação
**multiusuário na nuvem (Supabase)**, com **mesas/aventuras**, papel de **mestre**, e regras de jogo
ricas (inventário por catálogo, equipar armadura, proficiência por classe, magias e consumíveis em
tempo real). Abaixo, o resumo por área.

> ⚠️ **Passos manuais no Supabase** (necessários para rodar): ver a seção
> [Migrations & configuração](#migrations--configuração-supabase) ao final.

---

## 1. Backend na nuvem (Supabase) + deploy (Vercel)

Antes a persistência era `localStorage`. Agora:
- **Postgres** com a tabela `public.characters` (1 linha por ficha; o `Character` inteiro em `jsonb`),
  isolada por `owner_id` via **RLS**.
- **Storage** (bucket `avatars`) para os retratos — guardamos só a URL pública.
- **Client** em [`src/lib/supabase.ts`](src/lib/supabase.ts) lendo `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` ([`.env.example`](.env.example), tipado em
  [`src/vite-env.d.ts`](src/vite-env.d.ts)).
- **Camada de dados**: [`src/repositories/characterRepository.ts`](src/repositories/characterRepository.ts)
  (`fetchCharacters`, `fetchCharacterById`, `insertCharacter`, `updateCharacter`, `deleteCharacterRow`,
  `normalizeCharacter`). O [`useCharacterRoster`](src/hooks/useCharacterRoster.ts) foi reescrito para
  carregar/salvar na nuvem.
- **Avatares**: [`src/utils/uploadAvatar.ts`](src/utils/uploadAvatar.ts) faz upload ao bucket;
  `CharacterAvatar` passou a enviar para o Storage.
- **Deploy**: [`vercel.json`](vercel.json) com rewrite SPA; README com passos de deploy.

**Detalhe importante:** o salvar usa **`UPDATE`** (não `upsert`) para fichas existentes — assim o
mestre consegue gravar a ficha de um jogador sem esbarrar na policy de `INSERT`.

## 2. Autenticação (e-mail + senha)

- Login/cadastro por **e-mail e senha** ([`src/pages/AuthPage.tsx`](src/pages/AuthPage.tsx)).
- [`src/hooks/useAuthSession.ts`](src/hooks/useAuthSession.ts) acompanha a sessão; sessões anônimas
  legadas caem na tela de login.
- Gate de autenticação no [`src/App.tsx`](src/App.tsx): sem usuário → `AuthPage`; com usuário → app.
- (Histórico: começou com login anônimo; o bug de **usuários anônimos duplicados** foi corrigido
  tornando o início de sessão idempotente, e depois migramos para contas reais.)

## 3. Navegação por rotas (react-router)

- Rotas: `/` (lista de personagens), `/character/:id` (ficha), `/adventures`, `/adventures/:id`.
- A ficha é carregada sob demanda (`loadCharacter`) — permite o mestre abrir a ficha de um jogador.
- **Tela inicial** [`CharacterListPage`](src/pages/CharacterListPage.tsx): lista os personagens do
  usuário; selecionar abre a ficha.

## 4. Aventuras (mesas) + papel de Mestre

- Tabela `public.adventures` (mestre + `invite_code`) e `characters.adventure_id`.
- **Entrar por código** via RPCs `join_adventure` / `leave_adventure` (SECURITY DEFINER).
- **RLS**: o mestre da aventura **vê e edita** as fichas dos jogadores; jogadores só as próprias.
  Helpers `is_master_of` / `plays_in` (SECURITY DEFINER) evitam recursão entre policies.
- Páginas `AdventuresPage` (criar/entrar/listar) e `AdventureDetailPage` (visão do mestre).
- Papel é **por aventura** (quem cria é mestre; pode ser jogador em outra).

## 5. Layout e identidade da ficha

- **Edição por seção**: cada card tem seu próprio botão lápis→check
  ([`EditableSection`](src/components/character/EditableSection.tsx) +
  [`SectionEditContext`](src/contexts/SectionEditContext.tsx)); removido o "Editar" global. O **save**
  acontece ao concluir a seção (não auto-save a cada tecla); ações rápidas persistem na hora
  (`requestSave`).
- **Identidade** (Antecedente/Divindade) foi unida ao `HeroPanel`, lado a lado com alinhamento/título.
- **Antecedente**: select com descrições ([`BackgroundField`](src/components/character/BackgroundField.tsx),
  `BACKGROUND_OPTIONS`).
- **Divindade**: select filtrado pelo **alinhamento**; troca de alinhamento limpa a divindade inválida.
- **Tesouro** (PO/PP/PC) virou seção própria; **Ataques** e **Talentos/Magias** lado a lado.

## 6. Vitais e máquina de estados de morte

- Barra de PV reformatada (barra + `[−] x/y [+]` centralizado).
- Novo `condition` (`normal | dying | stabilized | dead`) em `Character`:
  - cair a 0 → **agonia** + diálogo de rodadas; timer a 0 → botão **"Declarar morto"**;
  - **Levantar** → **Estabilizado** (PV 0, sem risco); **Morto** com botão **Reverter**.
- [`ConditionBanner`](src/components/character/ConditionBanner.tsx) renderiza cada estado.

## 7. Inventário por catálogo (espaços, qualidade, nome)

- Catálogo [`src/constants/items.ts`](src/constants/items.ts) (equipamentos, armas, armaduras).
  O inventário deixou de ser texto livre: o jogador **escolhe da lista** (ou cria item personalizado).
- **Limite de espaços** = `max(Força, 10)` (`getInventorySlotCount`/`getUsedSlots`); bloqueia ao exceder.
- **Qualidade** de armas/armaduras (desgastada/normal/melhorada): normal usa o catálogo;
  desgastada/melhorada permitem editar **dano/CA** e **bônus**.
- **Nome dado** opcional (ex.: "Espada Longa" com badge "Talon").
- Linha extraída em [`InventoryItemRow`](src/components/character/InventoryItemRow.tsx); formulário de
  adicionar com seções "Do catálogo" / "Item personalizado".

## 8. Proficiência por classe → arma vira Ataque

- [`src/constants/proficiency.ts`](src/constants/proficiency.ts): armas/armaduras permitidas por classe.
- Ao adicionar uma **arma que a classe pode usar**, cria-se automaticamente um **Ataque** (nome, bônus,
  dano), vinculado via `attackId`; remover a arma remove o ataque. Armas não-usáveis ficam só no
  inventário.

## 9. Equipar armadura → CA automática

- Armadura com **CA base numérica** + `acAddsDex` (couro 11+DES, cota 13+DES, placas 15; escudo fora).
- Equipar (uma por vez, com **troca**) define a CA; badge **"Equipada/Não equipada"**; **diálogo**
  ao adicionar; clique na linha equipa/desequipa (mesmo fora da edição).
- A **CA virou derivada** ([`src/utils/armorClass.ts`](src/utils/armorClass.ts)) — sem armadura é
  `10 + mod DES`. O campo manual de CA nos Vitais foi **removido** (cálculo automático, reage à DES).

## 10. Magias (catálogo) na seção Talentos/Magias

- Catálogo [`src/constants/spells.ts`](src/constants/spells.ts) (Grau 1–2, mago/sacerdote).
- A seção permite **adicionar talento** (texto livre) ou **adicionar magia** via seletor filtrado por
  **classe e nível** ([`SpellsTalentsPanel`](src/components/character/SpellsTalentsPanel.tsx)).

## 11. Consumíveis em tempo real (tocha, lampião, luz)

- Catálogo [`src/constants/consumables.ts`](src/constants/consumables.ts) com **fonte** discriminada:
  inventário (tocha, lampião) ou magia (Luz). Itens de inventário consomem ao acender; a Luz não.
- **FAB ampulheta** ([`ConsumablesFab`](src/components/character/ConsumablesFab.tsx)) expande os
  consumíveis que o jogador tem; cada um pode ficar ativo ao mesmo tempo, com contagem regressiva,
  aviso final e alerta ao apagar ([`ConsumableButton`](src/components/character/ConsumableButton.tsx)).
- **Tempo real (Supabase Realtime)**: tabela `adventure_consumables` legível por todos os membros da
  mesa; [`useAdventureConsumables`](src/hooks/useAdventureConsumables.ts) assina via *Postgres Changes*.
  Assim todos veem as luzes acesas da mesa e o tempo restante. Correções: `REPLICA IDENTITY FULL`
  (entrega de DELETE) e trava de "uma vez" no cliente (evitava loop de DELETE/alerta preso).

---

## Migrations & configuração (Supabase)

Aplicar, na ordem, em `supabase/migrations/`:
1. `…_init.sql` — `characters` + RLS + bucket `avatars`.
2. `…_adventures.sql` — `adventures`, `characters.adventure_id`, helpers, RLS, RPCs.
3. `…_adventure_consumables.sql` — consumíveis compartilhados + RLS + publicação Realtime.
4. `…_adventure_consumables_replica.sql` — `replica identity full` (DELETE em tempo real).

No painel do Supabase:
- **Authentication → Email**: habilitar e **desligar "Confirm email"** (login imediato).
- **Storage**: o bucket `avatars` é criado pela migration (público para leitura).

## Variáveis de ambiente

`.env.local` (não versionado):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
Na Vercel, definir as mesmas variáveis.

## Verificação
- `npx tsc --noEmit` e `npm run build` sem erros.
- Fluxos manuais: criar conta → criar/abrir ficha; inventário (espaços, qualidade, equipar armadura,
  arma vira ataque); magias por classe/nível; consumíveis (tocha/lampião/luz) com contagem; aventura
  (mestre vê/edita fichas; luzes da mesa em tempo real).
