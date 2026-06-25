// types
import type {
  AbilityKey,
  Alignment,
  Character,
  InventoryItem,
} from '@/types/character';

// utils
import { createId } from '@/utils/createId';

export const STORAGE_KEY = 'shadow-dark:roster:v1';

export const MIN_INVENTORY_SLOTS = 10;

// Regra Shadow Dark: você carrega um número de itens igual ao seu valor de
// Força, ou 10, o que for maior.
export const getInventorySlotCount = (strengthScore: number): number => {
  return Math.max(strengthScore, MIN_INVENTORY_SLOTS);
};

// Espaços ocupados pelo inventário (quantidade × espaços de cada item).
export const getUsedSlots = (inventory: InventoryItem[]): number => {
  return inventory.reduce((total, item) => total + item.quantity * item.slots, 0);
};

export const ABILITY_ORDER: AbilityKey[] = [
  'for',
  'des',
  'con',
  'int',
  'sab',
  'car',
];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  for: 'Força',
  des: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  sab: 'Sabedoria',
  car: 'Carisma',
};

export const CLASS_OPTIONS: { value: string; label: string }[] = [
  { value: 'Guerreiro', label: 'Guerreiro' },
  { value: 'Ladrão', label: 'Ladrão' },
  { value: 'Clérigo', label: 'Clérigo' },
  { value: 'Mago', label: 'Mago' },
];

export const ANCESTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'Anão', label: 'Anão' },
  { value: 'Humano', label: 'Humano' },
  { value: 'Elfo', label: 'Elfo' },
  { value: 'Goblin', label: 'Goblin' },
  { value: 'Halfling', label: 'Halfling' },
  { value: 'Meio-Orc', label: 'Meio-Orc' },
];

type BackgroundOption = { value: string; label: string; description: string };

// Lista fixa de antecedentes (Shadow Dark) com suas descrições.
export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    value: 'Garoto de Rua',
    label: 'Garoto de Rua',
    description: 'Você cresceu nas ruas impiedosas de uma cidade grande.',
  },
  {
    value: 'Procurado',
    label: 'Procurado',
    description: 'Há um preço pela sua cabeça, mas você tem aliados.',
  },
  {
    value: 'Iniciado do Culto',
    label: 'Iniciado do Culto',
    description: 'Você conhece segredos e rituais blasfemos.',
  },
  {
    value: 'Guilda dos Ladrões',
    label: 'Guilda dos Ladrões',
    description: 'Você tem conexões, contatos e dívidas.',
  },
  {
    value: 'Banido',
    label: 'Banido',
    description: 'Seu povo o exilou por crimes que você supostamente cometeu.',
  },
  {
    value: 'Órfão',
    label: 'Órfão',
    description: 'Um guardião incomum o resgatou e o criou.',
  },
  {
    value: 'Aprendiz de Mago',
    label: 'Aprendiz de Mago',
    description: 'Você tem um dom natural e talento para magia.',
  },
  {
    value: 'Joalheiro',
    label: 'Joalheiro',
    description: 'Você pode identificar valores e autenticidade facilmente.',
  },
  {
    value: 'Herbalista',
    label: 'Herbalista',
    description: 'Você conhece plantas, remédios e venenos.',
  },
  {
    value: 'Bárbaro',
    label: 'Bárbaro',
    description: 'Você deixou a horda, mas ela não saiu totalmente de você.',
  },
  {
    value: 'Mercenário',
    label: 'Mercenário',
    description: 'Você lutou contra amigos e inimigos pelo seu dinheiro.',
  },
  {
    value: 'Marinheiro',
    label: 'Marinheiro',
    description: 'Pirata, corsário ou mercador: os mares são seus.',
  },
  {
    value: 'Acólito',
    label: 'Acólito',
    description: 'Você foi bem treinado em ritos religiosos e doutrinas.',
  },
  {
    value: 'Soldado',
    label: 'Soldado',
    description: 'Você serviu como combatente em um exército organizado.',
  },
  {
    value: 'Guardião',
    label: 'Guardião',
    description: 'As florestas e regiões selvagens são seu verdadeiro lar.',
  },
  {
    value: 'Batedor',
    label: 'Batedor',
    description: 'Você sobreviveu graças à furtividade, observação e velocidade.',
  },
  {
    value: 'Menestrel',
    label: 'Menestrel',
    description: 'Você viajou por longas distâncias com seu charme e talento.',
  },
  {
    value: 'Estudioso',
    label: 'Estudioso',
    description: 'Você sabe muito sobre história antiga e lendas.',
  },
  {
    value: 'Nobre',
    label: 'Nobre',
    description: 'Carregar um nome famoso abriu muitas portas para você.',
  },
  {
    value: 'Cirurgião',
    label: 'Cirurgião',
    description: 'Você entende de anatomia, cirurgias e primeiros socorros.',
  },
];

export const ALIGNMENT_OPTIONS: { value: Alignment; label: string }[] = [
  { value: 'Lawful', label: 'Ordeiro' },
  { value: 'Neutral', label: 'Neutro' },
  { value: 'Chaotic', label: 'Caótico' },
];

// Divindades por alinhamento (Shadow Dark). A lista disponível depende do
// alinhamento do personagem.
export const DEITY_OPTIONS: Record<Alignment, { value: string; label: string }[]> = {
  Lawful: [
    { value: 'Santa Terragnis', label: 'Santa Terragnis' },
    { value: 'Madeera, a Pactuadora', label: 'Madeera, a Pactuadora' },
    { value: 'Os perdidos', label: 'Os perdidos' },
  ],
  Neutral: [
    { value: 'Gede', label: 'Gede' },
    { value: 'Ord', label: 'Ord' },
    { value: 'Os perdidos', label: 'Os perdidos' },
  ],
  Chaotic: [
    { value: 'Memnon', label: 'Memnon' },
    { value: 'Ramlaat', label: 'Ramlaat' },
    { value: 'Shune, a Maléfica', label: 'Shune, a Maléfica' },
    { value: 'Os perdidos', label: 'Os perdidos' },
  ],
};

type ClassTitle = { levelRange: string; title: string };

// Títulos por classe → alinhamento → faixa de nível (Shadow Dark).
export const CLASS_TITLES: Record<string, Record<Alignment, ClassTitle[]>> = {
  Guerreiro: {
    Lawful: [
      { levelRange: '1-2', title: 'Escudeiro' },
      { levelRange: '3-4', title: 'Ginete' },
      { levelRange: '5-6', title: 'Cavaleiro' },
      { levelRange: '7-8', title: 'Barão' },
      { levelRange: '9-10', title: 'Lorde/Dama' },
    ],
    Chaotic: [
      { levelRange: '1-2', title: 'Valete' },
      { levelRange: '3-4', title: 'Bandido' },
      { levelRange: '5-6', title: 'Matador' },
      { levelRange: '7-8', title: 'Saqueador' },
      { levelRange: '9-10', title: 'Senhor da Guerra' },
    ],
    Neutral: [
      { levelRange: '1-2', title: 'Guerreiro' },
      { levelRange: '3-4', title: 'Bárbaro' },
      { levelRange: '5-6', title: 'Berserk' },
      { levelRange: '7-8', title: 'Chefe de Guerra' },
      { levelRange: '9-10', title: 'Líder' },
    ],
  },
  Ladrão: {
    Lawful: [
      { levelRange: '1-2', title: 'Malandro' },
      { levelRange: '3-4', title: 'Assaltante' },
      { levelRange: '5-6', title: 'Trapaceiro' },
      { levelRange: '7-8', title: 'Subchefe' },
      { levelRange: '9-10', title: 'Chefe' },
    ],
    Chaotic: [
      { levelRange: '1-2', title: 'Rufião' },
      { levelRange: '3-4', title: 'Degolador' },
      { levelRange: '5-6', title: 'Sombra' },
      { levelRange: '7-8', title: 'Assassino' },
      { levelRange: '9-10', title: 'Fantasma' },
    ],
    Neutral: [
      { levelRange: '1-2', title: 'Bandoleiro' },
      { levelRange: '3-4', title: 'Fora da Lei' },
      { levelRange: '5-6', title: 'Ladino' },
      { levelRange: '7-8', title: 'Renegado' },
      { levelRange: '9-10', title: 'Rei/Rainha dos Bandidos' },
    ],
  },
  Clérigo: {
    Lawful: [
      { levelRange: '1-2', title: 'Acólito' },
      { levelRange: '3-4', title: 'Cruzado' },
      { levelRange: '5-6', title: 'Templário' },
      { levelRange: '7-8', title: 'Campeão' },
      { levelRange: '9-10', title: 'Paladino' },
    ],
    Chaotic: [
      { levelRange: '1-2', title: 'Iniciado' },
      { levelRange: '3-4', title: 'Fanático' },
      { levelRange: '5-6', title: 'Cultista' },
      { levelRange: '7-8', title: 'Carrasco' },
      { levelRange: '9-10', title: 'Cavaleiro do Caos' },
    ],
    Neutral: [
      { levelRange: '1-2', title: 'Rastreador' },
      { levelRange: '3-4', title: 'Invocador' },
      { levelRange: '5-6', title: 'Arúspice' },
      { levelRange: '7-8', title: 'Místico' },
      { levelRange: '9-10', title: 'Oráculo' },
    ],
  },
  Mago: {
    Lawful: [
      { levelRange: '1-2', title: 'Aprendiz' },
      { levelRange: '3-4', title: 'Conjurador' },
      { levelRange: '5-6', title: 'Arcanista' },
      { levelRange: '7-8', title: 'Magista' },
      { levelRange: '9-10', title: 'Arquimago' },
    ],
    Chaotic: [
      { levelRange: '1-2', title: 'Adepto' },
      { levelRange: '3-4', title: 'Canalizador' },
      { levelRange: '5-6', title: 'Bruxo' },
      { levelRange: '7-8', title: 'Diabolista' },
      { levelRange: '9-10', title: 'Feiticeiro' },
    ],
    Neutral: [
      { levelRange: '1-2', title: 'Xamã' },
      { levelRange: '3-4', title: 'Vidente' },
      { levelRange: '5-6', title: 'Guardião' },
      { levelRange: '7-8', title: 'Sábio' },
      { levelRange: '9-10', title: 'Druida' },
    ],
  },
};

const TITLE_TIER_COUNT = 5;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const BASE_XP_THRESHOLD = 10;

// XP necessário para subir do nível atual para o próximo.
// Regra: dobra a cada nível → 10 (1→2), 20 (2→3), 40 (3→4)...
export const getXpThreshold = (level: number): number => {

  return BASE_XP_THRESHOLD * level;
};

// Título único correspondente à classe + alinhamento + faixa do nível atual.
// Faixas: 1-2, 3-4, 5-6, 7-8, 9-10 → índice = ceil(nível / 2), limitado a [1, 5].
export const getMatchingTitle = (
  className: string,
  alignment: Alignment,
  level: number,
): string => {
  const tierIndex = clamp(Math.ceil(level / 2), 1, TITLE_TIER_COUNT) - 1;

  return CLASS_TITLES[className]?.[alignment]?.[tierIndex]?.title ?? '';
};

export const createDefaultCharacter = (
  name = 'Novo Personagem',
): Character => {
  return {
    id: createId(),
    createdAt: Date.now(),
    name,
    avatar: '',
    abilities: {
      for: { score: 10 },
      des: { score: 10 },
      con: { score: 10 },
      int: { score: 10 },
      sab: { score: 10 },
      car: { score: 10 },
    },
    ancestry: 'Humano',
    class: 'Guerreiro',
    level: 1,
    xp: 0,
    title: getMatchingTitle('Guerreiro', 'Neutral', 1),
    alignment: 'Neutral',
    background: 'Garoto de Rua',
    backstory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.',
    deity: '',
    hitPoints: { current: 6, max: 6 },
    deathTimer: null,
    condition: 'normal',
    attacks: [],
    talents: [],
    spells: [],
    coins: { gold: 0, silver: 0, copper: 0 },
    inventory: [],
    consumables: [],
    freeCarry: '',
  };
};
