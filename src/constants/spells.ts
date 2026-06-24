// Catálogo de magias do Shadow Dark. Cada magia tem um grau (tier) e a(s)
// classe(s) que podem conjurá-la. A lista disponível depende da classe e do
// nível do personagem.

export type SpellClass = 'mago' | 'sacerdote';

export type Spell = {
  id: string;
  name: string;
  tier: number; // grau (1-5)
  classes: SpellClass[];
  duration: string;
  range: string;
  description: string;
};

const SPELL_CLASS_LABELS: Record<SpellClass, string> = {
  mago: 'Mago',
  sacerdote: 'Sacerdote',
};

export const formatSpellClasses = (classes: SpellClass[]): string =>
  classes.map((spellClass) => SPELL_CLASS_LABELS[spellClass]).join(' / ');

export const SPELLS: Spell[] = [
  {
    id: 'alarme',
    name: 'Alarme',
    tier: 1,
    classes: ['mago'],
    duration: '1 dia',
    range: 'Adjacente',
    description:
      'Você toca um objeto, como o limiar de uma porta, e insere um alarme mágico nele. Se qualquer criatura que você não designou durante a conjuração tocar ou atravessar esse objeto, um sino mágico soará em sua mente.',
  },
  {
    id: 'alterar-se',
    name: 'Alterar-se',
    tier: 2,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Pessoal',
    description:
      'Você altera magicamente a sua forma física, ganhando uma característica que modifica sua anatomia atual (ex.: guelras, garras de urso). Não pode fazer crescer asas ou membros.',
  },
  {
    id: 'arma-purificadora',
    name: 'Arma Purificadora',
    tier: 2,
    classes: ['sacerdote'],
    duration: '5 rodadas',
    range: 'Adjacente',
    description:
      'Uma arma que você toca é envolvida por chamas purificadoras. Ela causa 1d4 de dano adicional (1d6 contra mortos-vivos) ao longo da duração.',
  },
  {
    id: 'arma-sagrada',
    name: 'Arma Sagrada',
    tier: 1,
    classes: ['sacerdote'],
    duration: '5 rodadas',
    range: 'Adjacente',
    description:
      'Uma arma que você toca é imbuída com uma bênção sagrada. A arma se torna mágica e passa a ter +1 em jogadas de ataque e dano ao longo da duração.',
  },
  {
    id: 'armadura-arcana',
    name: 'Armadura Arcana',
    tier: 1,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Pessoal',
    description:
      'Uma camada invisível de força mágica protege seus órgãos vitais. Sua CA se torna 14 (ou 18, em caso de sucesso crítico no teste de conjuração) enquanto a magia durar.',
  },
  {
    id: 'arrombar',
    name: 'Arrombar',
    tier: 2,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Uma porta, janela, portão, baú ou portal que você possa ver e que esteja dentro do alcance se abre instantaneamente, superando todas as fechaduras e barreiras mundanas. Cria um barulho alto ouvido por todas as criaturas ao alcance da sua voz.',
  },
  {
    id: 'augurio',
    name: 'Augúrio',
    tier: 2,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Você interpreta o significado de presságios sobrenaturais. Faça uma pergunta ao MJ sobre um curso de ação específico; ele responderá se será "próspera" ou um "infortúnio".',
  },
  {
    id: 'bencao',
    name: 'Bênção',
    tier: 2,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description: 'Uma criatura que você toca ganha uma ficha de sorte.',
  },
  {
    id: 'cegueira-surdez',
    name: 'Cegueira/Surdez',
    tier: 2,
    classes: ['sacerdote'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você profere uma censura divina, cegando ou ensurdecendo uma criatura que você possa ver e que esteja dentro do alcance. A criatura tem DESV em tarefas que dependam do sentido perdido.',
  },
  {
    id: 'curar-ferimentos',
    name: 'Curar Ferimentos',
    tier: 1,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Seu toque restaura uma vida reduzida. Role uma quantidade de d6 igual a 1 + metade do seu nível (arredondando para baixo). Um alvo que você tocar recupera essa quantidade de pontos de vida.',
  },
  {
    id: 'destruicao',
    name: 'Destruição',
    tier: 2,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Você invoca chamas punitivas sobre uma criatura que você possa ver e que esteja dentro do alcance. Ela sofre 1d6 de dano.',
  },
  {
    id: 'detectar-magia',
    name: 'Detectar Magia',
    tier: 1,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você sente a presença de magia dentro do alcance Perto enquanto a magia durar. Concentrando-se por duas rodadas, identifica suas propriedades gerais. Barreiras completas bloqueiam esta magia.',
  },
  {
    id: 'detectar-pensamentos',
    name: 'Detectar Pensamentos',
    tier: 2,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você espia a mente de uma criatura que você possa ver e que esteja dentro do alcance, desvendando seus pensamentos imediatos a cada rodada. No turno dele, o alvo faz um teste de Sabedoria contra seu teste de conjuração; se passar, percebe você e a magia se encerra.',
  },
  {
    id: 'disco-flutuante',
    name: 'Disco Flutuante',
    tier: 1,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Perto',
    description:
      'Você cria um disco de força flutuante que carrega o equivalente a 20 espaços de equipamento. Ele flutua ao nível da sua cintura e permanece Perto. Não pode cruzar abismos mais profundos que a altura de um humano.',
  },
  {
    id: 'encantar-pessoa',
    name: 'Encantar Pessoa',
    tier: 1,
    classes: ['mago'],
    duration: '1d8 dias',
    range: 'Perto',
    description:
      'Você encanta um humanoide de nível 2 ou menor que esteja Perto. Ele o considera um amigo enquanto durar. Encerra se ele perceber que você ou aliados tentaram machucá-lo. Ao fim, ele saberá que foi encantado.',
  },
  {
    id: 'escudo-da-fe',
    name: 'Escudo da Fé',
    tier: 1,
    classes: ['sacerdote'],
    duration: '5 rodadas',
    range: 'Pessoal',
    description:
      'Uma força protetora, forjada pela sua crença divina, circunda você. Você ganha um bônus de +2 em sua classe de armadura ao longo da duração.',
  },
  {
    id: 'expulsar-mortos-vivos',
    name: 'Expulsar Mortos-Vivos',
    tier: 1,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Você repele mortos-vivos, apresentando um símbolo sagrado. Mortos-vivos Perto fazem um teste de Carisma contra seu teste de conjuração. Falha por 10+ e nível ≤ o seu: destruído. Falha por menos: foge por 5 rodadas.',
  },
  {
    id: 'flecha-acida',
    name: 'Flecha Ácida',
    tier: 2,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Longe',
    description:
      'Você conjura uma flecha corrosiva que atinge um inimigo, causando 1d6 de dano por rodada. A flecha permanece no alvo enquanto durar sua concentração.',
  },
  {
    id: 'imobilizar-pessoa',
    name: 'Imobilizar Pessoa',
    tier: 2,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você paralisa magicamente uma criatura humanoide de nível 4 ou menor que você possa ver e que esteja dentro do alcance.',
  },
  {
    id: 'invisibilidade',
    name: 'Invisibilidade',
    tier: 2,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Adjacente',
    description:
      'Uma criatura que você toca se torna invisível enquanto a magia durar. A magia se encerra se o alvo atacar ou conjurar uma magia.',
  },
  {
    id: 'levitacao',
    name: 'Levitação',
    tier: 2,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Pessoal',
    description:
      'Você flutua verticalmente pelo equivalente à distância Perto por rodada em seu turno. Também pode se impulsionar contra objetos sólidos para se mover horizontalmente.',
  },
  {
    id: 'luz',
    name: 'Luz',
    tier: 1,
    classes: ['mago', 'sacerdote'],
    duration: '1 hora de tempo real',
    range: 'Adjacente',
    description:
      'Um objeto que você toca se ilumina com uma luz brilhante que não emite calor, clareando até a distância Perto, durante 1 hora de tempo real.',
  },
  {
    id: 'maos-flamejantes',
    name: 'Mãos Flamejantes',
    tier: 1,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Você libera um círculo de chamas que preenche uma área Adjacente ao seu redor. Criaturas na área sofrem 1d6 de dano, e objetos inflamáveis se incendeiam.',
  },
  {
    id: 'missil-magico',
    name: 'Míssil Mágico',
    tier: 1,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Longe',
    description:
      'Você tem Vantagem no teste de conjuração desta magia. Um raio de força brilhante se projeta de sua mão aberta, causando 1d4 de dano a um alvo.',
  },
  {
    id: 'objeto-fixo',
    name: 'Objeto Fixo',
    tier: 2,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Adjacente',
    description:
      'Um objeto que você toca e que pese até 2 kg se torna fixo em sua posição atual. Ele pode sustentar até duas toneladas enquanto a magia durar.',
  },
  {
    id: 'obstruir-porta',
    name: 'Obstruir Porta',
    tier: 1,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Perto',
    description:
      'Enquanto durar, você mantém um portal magicamente fechado. Uma criatura deve ter sucesso em um teste de Força contra seu teste de conjuração para abri-lo. A magia Arrombar encerra esta magia.',
  },
  {
    id: 'passo-nebuloso',
    name: 'Passo Nebuloso',
    tier: 2,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Em uma nuvem de fumaça, você se teleporta para uma área Perto e que você possa ver.',
  },
  {
    id: 'protecao-contra-o-mal',
    name: 'Proteção Contra o Mal',
    tier: 1,
    classes: ['mago', 'sacerdote'],
    duration: 'concentração',
    range: 'Adjacente',
    description:
      'Seres caóticos têm Desvantagem em ataques e conjurações hostis contra o alvo, e não podem possuí-lo, induzi-lo ou encantá-lo. Em um alvo já possuído, a entidade faz um teste de Carisma contra o último teste de conjuração; se falhar, é expulsa.',
  },
  {
    id: 'queda-suave',
    name: 'Queda Suave',
    tier: 1,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Você pode conjurar ao cair: a velocidade da sua queda diminui e você aterrissa sobre seus pés de forma segura.',
  },
  {
    id: 'reflexos',
    name: 'Reflexos',
    tier: 2,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Pessoal',
    description:
      'Você cria cópias ilusórias de si mesmo igual à metade do seu nível (mínimo de 1). A cada ataque contra você, o ataque erra e uma cópia evapora. Quando todas somem, a magia se encerra.',
  },
  {
    id: 'silencio',
    name: 'Silêncio',
    tier: 2,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Longe',
    description:
      'Você silencia um cubo de tamanho Perto dentro do alcance. Criaturas na área ficam surdas e quaisquer sons que emitam não serão ouvidos.',
  },
  {
    id: 'sono',
    name: 'Sono',
    tier: 1,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Você preenche um cubo de tamanho Perto a partir de você. Criaturas vivas de nível 2 ou menor na área caem em sono profundo. Sacudi-las vigorosamente ou causar dano as desperta.',
  },
  {
    id: 'teia',
    name: 'Teia',
    tier: 2,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Longe',
    description:
      'Você cria um cubo de tamanho Perto de teia densa e pegajosa. Uma criatura presa não pode se mover e deve ter sucesso em um teste de Força contra seu teste de conjuração para se libertar.',
  },
  {
    id: 'zona-da-verdade',
    name: 'Zona da Verdade',
    tier: 2,
    classes: ['sacerdote'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você induz uma criatura que você possa ver a falar a verdade. Ela não pode proferir uma mentira proposital enquanto estiver dentro do alcance.',
  },
];

const SPELL_BY_ID = new Map(SPELLS.map((spell) => [spell.id, spell]));

export const getSpell = (id: string): Spell | undefined => SPELL_BY_ID.get(id);

// Classe de conjuração da classe do personagem (não-conjuradores → null).
export const getSpellClass = (className: string): SpellClass | null => {
  if (className === 'Mago') return 'mago';
  if (className === 'Clérigo') return 'sacerdote';
  return null;
};

// Grau máximo acessível por nível: 1-2→1, 3-4→2, 5-6→3, 7-8→4, 9-10→5.
export const getMaxSpellTier = (level: number): number =>
  Math.min(Math.max(Math.ceil(level / 2), 1), 5);

// Magias que o personagem pode escolher (classe conjuradora + grau ≤ máximo).
export const getAvailableSpells = (
  className: string,
  level: number,
): Spell[] => {
  const spellClass = getSpellClass(className);
  if (!spellClass) return [];

  const maxTier = getMaxSpellTier(level);
  return SPELLS.filter(
    (spell) => spell.classes.includes(spellClass) && spell.tier <= maxTier,
  );
};
