---
name: shadowdark-rules
description: Informações centrais, regras de negócio e mecânicas do RPG Shadowdark. Acione esta skill toda vez que for implementar regras de cálculo de atributos, regras de inventário, progressão de nível, magias ou outras mecânicas de sistema dentro do código.
---

# Regras e Mecânicas do Shadowdark RPG

Este documento serve como base de conhecimento das regras de negócio do Shadowdark para guiar o desenvolvimento do sistema (especialmente a ficha de personagem). Sempre que formos programar cálculos e lógicas, essas são as premissas a serem seguidas:

## 1. Atributos (Abilities) e Modificadores
Existem 6 atributos principais: Força (STR), Destreza (DEX), Constituição (CON), Inteligência (INT), Sabedoria (WIS) e Carisma (CHA). 
Os modificadores seguem uma tabela fixa:
*   1 a 3: **-4**
*   4 a 5: **-3**
*   6 a 7: **-2**
*   8 a 9: **-1**
*   10 a 11: **0**
*   12 a 13: **+1**
*   14 a 15: **+2**
*   16 a 17: **+3**
*   18+: **+4**

## 2. Inventário e Espaços (Gear Slots)
Uma das mecânicas mais importantes do jogo é o limite de carga rigoroso.
*   **Capacidade Máxima:** Um personagem tem um total de espaços de inventário igual a **10 ou ao valor do seu atributo de Força (STR)**, o que for maior.
*   **Tamanho dos Itens:** A maioria dos itens ocupa 1 espaço. Itens pesados (como armaduras pesadas e armas de duas mãos) ocupam 2 espaços. Itens pequenos podem não ocupar espaço ou ser agrupados.
*   **Dinheiro:** Cada **100 moedas** (qualquer tipo) ocupam 1 espaço de inventário.
*   **Gemas e Joias:** Ocupam espaços baseados no tamanho, mas frequentemente 1 joia valiosa = 1 espaço (ou agrupamentos pequenos).

## 3. Pontos de Vida (Hit Points) e Morte
*   A vida inicial é definida pelo Dado de Vida (Hit Die) da Classe + Modificador de Constituição (mínimo de 1 PV).
*   Ao chegar a 0 PV, o personagem cai inconsciente e um **Timer da Morte (Death Timer)** é acionado (rolagem de 1d4 + mod. de CON em rodadas para morrer definitivamente).

## 4. Conjuração de Magias (Spellcasting)
*   Diferente de D&D tradicional, magias não usam espaços de magia (spell slots). 
*   O personagem deve fazer um **Teste de Conjuração** (d20 + modificador do atributo mágico). 
*   Se falhar, não pode mais lançar aquela magia específica até descansar.
*   Um 1 natural (falha crítica) resulta em um **Mishap** (Desastre Mágico) rolado em uma tabela.
*   Um 20 natural dobra o efeito numérico ou a duração da magia.

## 5. Equipamento e Armadura (Armor Class)
*   A **Classe de Armadura (CA/AC)** base é 10 + mod. de Destreza (se sem armadura).
*   Escudos concedem +2 na CA, mas ocupam 1 espaço de inventário e uma das mãos.
*   Armaduras substituem o cálculo base dependendo do tipo (Leve soma DEX, Pesada não soma, etc).

## 6. Iluminação e Tempo (A Tocha)
*   O Shadowdark tem foco enorme na passagem do tempo real. Uma tocha dura exatamente **1 hora na vida real**. O sistema deve idealmente ser capaz de acomodar esse rastreamento de tempo.

## 7. Progressão e Nível
*   Toda vez que sobem de nível, os jogadores ganham novos PV (rolando o Dado de Vida e adicionando CON) e rolam talentos (Talents) na tabela da sua Classe, que podem modificar atributos (+2 num atributo ou +1 em dois), garantir bônus em rolagens de combate ou conjuração.

---
*Observação para o desenvolvimento: Adicione ou modifique regras aqui sempre que novas necessidades mecânicas ou expansões da ficha forem planejadas (ex: cálculo autônomo de slots e penalidade por sobrecarga).*
