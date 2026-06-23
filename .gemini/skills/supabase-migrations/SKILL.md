---
name: shadow-dark-supabase-migrations
description: Diretrizes e comandos para a criação e gerenciamento de migrações de banco de dados no Supabase. Acione esta skill toda vez que houver a necessidade de alterar a estrutura do banco, adicionar tabelas, alterar políticas (RLS) ou adicionar novas permissões (GRANTS).
---

# Gerenciamento de Migrações (Supabase)

O banco de dados do projeto **Shadow Dark** é versionado e gerenciado através do Supabase CLI. Todas as alterações no banco (novas tabelas, colunas, functions, RLS e grants) devem obrigatoriamente ser feitas através de um arquivo de **Migration**, garantindo a integridade dos ambientes local e em nuvem.

## 1. Criar uma Nova Migration

Para criar um novo script de migração:

```bash
npx supabase migration new nome_da_migracao
```
*Isso criará um arquivo SQL com timestamp na pasta `supabase/migrations/`.*

## 2. Escrever a Migration (Regras Essenciais)

Ao redigir o SQL dentro do arquivo criado, siga rigorosamente as seguintes regras de segurança e estabilidade para a stack:

1.  **Criação Segura**: Sempre use `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, ou `DROP POLICY IF EXISTS` para evitar falhas durante o fluxo de CI/CD.
2.  **Row Level Security (RLS)**: É **obrigatório** ativar o RLS para todas as tabelas criadas no schema `public`.
    ```sql
    ALTER TABLE public.nova_tabela ENABLE ROW LEVEL SECURITY;
    ```
3.  **Policies**: Crie políticas claras limitando quem pode consultar (`SELECT`), inserir (`INSERT`), atualizar (`UPDATE`) e deletar (`DELETE`). Geralmente associando regras ao `auth.uid()`.
4.  **GRANTS (Crucial)**: Novas tabelas ou functions criadas no Postgres não recebem permissões explícitas automaticamente para os roles web do PostgREST. **Sempre** conceda as permissões ao final do arquivo:
    ```sql
    GRANT ALL ON TABLE public.nova_tabela TO anon, authenticated;
    ```
    *Se for uma function:*
    ```sql
    GRANT EXECUTE ON FUNCTION public.nome_da_function() TO anon, authenticated;
    ```

## 3. Testar a Migration Localmente

Ao finalizar o script SQL, você deve aplicar as mudanças ao contêiner Postgres local. 

**Opção A (Aplicar apenas as mudanças pendentes):**
```bash
npx supabase db push --local
```

**Opção B (Recriar o banco do zero — *Recomendado se houverem conflitos*):**
```bash
npx supabase db reset
```
*Lembre-se: O `db reset` irá zerar os dados de desenvolvimento e reaplicar tudo do início.*

## 4. Gerar Migrações Automaticamente (Diffing)

Se as tabelas forem editadas via UI (Supabase Studio Local em http://127.0.0.1:54323), você pode pedir para a CLI capturar as alterações e gerar uma migration automática.

Para inspecionar o que foi alterado antes de salvar:
```bash
npx supabase db diff
```

Para gerar a migration salvando em arquivo:
```bash
npx supabase db diff -f nome_da_migracao
```
*(Importante: sempre revise o código gerado pelo diff para garantir que os GRANTS e RLS estão presentes).*
