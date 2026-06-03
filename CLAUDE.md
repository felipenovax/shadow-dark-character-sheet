# Diretrizes de Código Limpo — Frontend React + Chakra UI

## Objetivo

Garantir um código:

- Escalável
- Legível
- Fácil de manter
- Reutilizável
- Padronizado entre o time

---

# Stack e Padrões Obrigatórios

## UI

- Utilizar `Chakra UI` sempre que possível
- Evitar CSS puro quando o Chakra resolver o problema
- Preferir:
  - `Flex`
  - `Grid`
  - `Stack`
  - `SimpleGrid`
  - Props de espaçamento (`gap`, `p`, `m`, etc)
  - Props de espaçamento (`gap`, `p`, `m`, etc)
  - espaçamentos com multiplos de 4 (ex: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40)
  - espaçamentos em padrao rem (ex: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 1.75rem, 2rem, 2.25rem, 2.5rem)

## Componentização

- Componentes devem ter responsabilidade única
- Evitar componentes gigantes
- Componentes acima de ~150 linhas devem ser avaliados para extração

---

# Processo Antes de Codar

Antes de implementar qualquer feature:

## 1. Definir Critérios de Aceitação

Sempre listar:

### Exemplo

```txt
Critérios de Aceitação

- Usuário consegue visualizar lista de reservas
- Usuário consegue filtrar por data
- Loading deve aparecer durante requisição
- Deve existir estado de vazio
- Deve funcionar em mobile
```

---

## 2. Definir Princípios de Clean Code Utilizados

Sempre declarar quais princípios serão aplicados.

### Exemplo

```txt
Princípios utilizados

- SRP (Single Responsibility Principle)
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Early Return
- Funções puras sempre que possível
- Composição ao invés de condicionais complexas
```

---

# Diretrizes de Clean Code

## 1. Nomes Claros e Autoexplicativos

### ❌ Ruim

```ts
const d = users.filter((x) => x.active);
```

### ✅ Bom

```ts
const activeUsers = users.filter((user) => user.isActive);
```

---

## 2. Funções Pequenas

### Regra

Uma função deve fazer apenas UMA coisa.

### ❌ Ruim

```ts
const handleSubmit = async () => {
  validate();
  formatData();
  sendRequest();
  showToast();
  redirect();
};
```

### ✅ Bom

```ts
const handleSubmit = async () => {
  const formattedData = buildPayload();

  await submitForm(formattedData);

  showSuccessFeedback();
};
```

---

## 3. Preferir Funções Puras

Funções puras:

- Não alteram estado externo
- Não possuem efeitos colaterais
- São previsíveis

### ✅ Bom

```ts
const calculateTotalPrice = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price, 0);
};
```

---

## 4. Aplicar DRY (Don't Repeat Yourself)

Ao identificar lógica repetida:

- Extrair utilitários
- Criar hooks
- Criar componentes reutilizáveis

### ❌ Ruim

```ts
const formattedPhone = phone.replace(/\D/g, '');
const formattedCpf = cpf.replace(/\D/g, '');
```

### ✅ Bom

```ts
const removeNonNumericCharacters = (value: string) => {
  return value.replace(/\D/g, '');
};
```

---

## 5. Evitar Condicionais Complexas

### ❌ Ruim

```tsx
if (user && user.profile && user.profile.permissions) {
}
```

### ✅ Bom

```tsx
const hasPermissions = Boolean(user?.profile?.permissions);
```

---

## 6. Early Return

Reduz aninhamentos desnecessários.

### ❌ Ruim

```ts
if (user) {
  if (user.active) {
    return 'ok';
  }
}
```

### ✅ Bom

```ts
if (!user) return null;

if (!user.active) return null;

return 'ok';
```

---

## 7. Evitar Componentes Monolíticos

### ❌ Ruim

Um componente:

- Busca dados
- Renderiza UI
- Faz validação
- Controla modal
- Faz formatação
- Faz regras de negócio

### ✅ Bom

Separar em:

- Hook
- Serviço
- Componente de apresentação
- Utilitários

---

# Organização de Pastas

```txt
src/
├── components/
├── pages/
├── hooks/
├── services/
├── utils/
├── types/
├── constants/
├── contexts/
└── styles/
```

---

# Padrão de Componentes

## Estrutura Recomendada

```tsx
type Props = {
  title: string;
};

export const SectionHeader = ({ title }: Props) => {
  return (
    <Flex align="center" justify="space-between">
      <Heading size="md">{title}</Heading>
    </Flex>
  );
};
```

---

# Regras para Chakra UI

## Preferir Props ao invés de CSS manual

### ❌ Ruim

```tsx
<Box style={{ padding: '16px' }}>
```

### ✅ Bom

```tsx
<Box p="1rem">
```

---

## Preferir Stack para espaçamento vertical

### ❌ Ruim

```tsx
<Box>
  <Text mb="4">Nome</Text>
  <Text mb="4">Email</Text>
</Box>
```

### ✅ Bom

```tsx
<VStack gap="1rem" align="stretch">
  <Text>Nome</Text>
  <Text>Email</Text>
</VStack>
```

---

## Preferir Grid do Chakra

### ✅ Bom

```tsx
<Grid templateColumns="repeat(2, 1fr)" gap="1rem">
  <Box />
  <Box />
</Grid>
```

---

# Hooks Customizados

## Quando Criar

Criar hooks quando existir:

- Lógica reutilizável
- Estado complexo
- Integração com API
- Regras compartilhadas

### Exemplo

```ts
const useReservations = () => {
  const [reservations, setReservations] = useState([])

  const loadReservations = async () => {
    ...
  }

  return {
    reservations,
    loadReservations,
  }
}
```

---

# Tratamento de Estados

Toda tela deve tratar:

- Loading
- Empty State
- Error State
- Success State

---

# Refatoração e Code Review

Antes de finalizar uma tarefa:

## Sempre analisar:

### Code Smells

- Funções grandes
- Props demais
- Condicionais excessivas
- Repetição de lógica
- Variáveis com nomes ruins
- JSX muito extenso
- Efeitos colaterais escondidos
- Estados desnecessários
- Duplicação de estilos

---

# Processo de Refatoração

## Sempre seguir:

### 1. Identificar o problema

```txt
A lógica de formatação de datas está repetida em 4 componentes.
```

### 2. Explicar impacto

```txt
Isso dificulta manutenção e aumenta risco de inconsistência.
```

### 3. Propor solução

```txt
Extrair para:
utils/formatDate.ts
```

### 4. Refatorar incrementalmente

- Pequenas alterações
- Fácil revisão
- Fácil rollback

---

# Padrão para Revisão de Código

## Durante análise do código:

Sempre responder:

```txt
- Quais code smells existem
- Quais princípios estão sendo violados
- Como refatorar
- O que pode ser extraído
- O que pode virar hook
- O que pode virar componente
- O que pode virar utilitário
```

---

# Performance

## Evitar

- Re-renderizações desnecessárias
- useEffect desnecessário
- Estados duplicados
- Cálculos pesados em render

## Preferir

- useMemo
- useCallback
- Componentes desacoplados
- Lazy loading quando necessário

---

# Padronização de Imports

## Ordem

```ts
// libs
import { useState } from 'react';

// ui
import { Box, Flex } from '@chakra-ui/react';

// services
import { api } from '@/services/api';

// hooks
import { useAuth } from '@/hooks/useAuth';

// utils
import { formatCurrency } from '@/utils/formatCurrency';

// styles
import * as S from './styles';
```

---

# Regra Final

Todo código novo deve ser:

- Simples
- Legível
- Reutilizável
- Testável
- Escalável

Sempre priorizar:

1. Clareza
2. Manutenção
3. Consistência
4. Reutilização
5. Performance
