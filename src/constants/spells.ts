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
    id: 'animar-mortos',
    name: 'Animar Mortos',
    tier: 3,
    classes: ['mago'],
    duration: '1 dia',
    range: 'Adjacente',
    description:
      'Você toca os restos mortais de um humanoide, e ele se ergue como um zumbi ou esqueleto sob seu controle. Os restos devem ter pelo menos três membros e a cabeça intactos. A criatura age em seu turno. Após 1 dia, ela se desfaz em pó sepulcral.',
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
    id: 'bola-de-fogo',
    name: 'Bola de Fogo',
    tier: 3,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Longe',
    description:
      'Você lança uma pequena chama que se transforma em uma explosão de fogo. Todas as criaturas em um cubo de tamanho Perto, ao redor de onde a chama cai, sofrem 4d6 de dano.',
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
    id: 'circulo-magico',
    name: 'Círculo Mágico',
    tier: 3,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você conjura um círculo de runas em um cubo de tamanho Perto centrado em você. Escolha um tipo de criatura (demônios, por exemplo). Enquanto durar, criaturas do tipo escolhido não podem atacar ou conjurar magias hostis contra quem está dentro do círculo, nem possuir, induzir ou encantar esses alvos.',
  },
  {
    id: 'coluna-de-chamas',
    name: 'Coluna de Chamas',
    tier: 4,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Longe',
    description:
      'Você invoca um pilar de fogo sagrado, imolando uma criatura que você possa ver e que esteja dentro do alcance. O alvo sofre 2d6 de dano.',
  },
  {
    id: 'comando',
    name: 'Comando',
    tier: 3,
    classes: ['sacerdote'],
    duration: 'concentração',
    range: 'Longe',
    description:
      'Você emite um comando verbal de uma palavra (como "ajoelhe-se") para uma criatura dentro do alcance e que possa entender você. O alvo obedece enquanto você mantiver a concentração. Se o comando for diretamente prejudicial, ela pode fazer um teste de Carisma contra seu teste de conjuração; com sucesso, a magia se encerra.',
  },
  {
    id: 'comunhao',
    name: 'Comunhão',
    tier: 4,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Você busca os conselhos de seu deus. Faça até três perguntas de "sim" ou "não" ao MJ, que responderá honestamente. Conjurar mais de uma vez em 24 horas faz uma falha no teste de conjuração contar como falha crítica.',
  },
  {
    id: 'confusao',
    name: 'Confusão',
    tier: 4,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você hipnotiza uma criatura que você possa ver e que esteja dentro do alcance. O alvo não pode realizar ações e se move em direção aleatória no turno dele. Se for de nível 9+, pode fazer um teste de SAB contra seu teste de conjuração no início do turno para encerrar a magia.',
  },
  {
    id: 'controlar-agua',
    name: 'Controlar Água',
    tier: 4,
    classes: ['mago', 'sacerdote'],
    duration: 'concentração',
    range: 'Longe',
    description:
      'Você move e molda a água. Pode fazer um corpo de água de até 30 metros (em largura e profundidade) mudar de forma, desafiar a gravidade, ou fluir em uma direção diferente.',
  },
  {
    id: 'criar-morto-vivo',
    name: 'Criar Morto-Vivo',
    tier: 5,
    classes: ['mago'],
    duration: '1 dia',
    range: 'Adjacente',
    description:
      'Você conjura uma criatura morta-viva com sede de vingança para agir conforme seus comandos. Ao conjurar, escolhe invocar um inumano ou uma aparição. A criatura surge ao seu lado, sob seu controle, e age em seu turno. Depois de 1 dia, ela se desfaz em fumaça.',
  },
  {
    id: 'criar-passagem',
    name: 'Criar Passagem',
    tier: 4,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Adjacente',
    description:
      'Um túnel da sua altura se abre em um obstáculo que você tocar, e permanece ao longo da duração. O comprimento pode ser, no máximo, igual à distância Perto, e precisa ser em linha reta.',
  },
  {
    id: 'cupula-antimagia',
    name: 'Cúpula Antimagia',
    tier: 5,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Pessoal',
    description:
      'Um cubo de anulação mágica, invisível e de tamanho Perto, surge centrado em você. Dentro dele, nenhuma magia pode ser conjurada; itens mágicos e magias não têm efeito e não podem entrar. O cubo se move com você. Dissipar magia não tem efeito sobre ele; outra cúpula antimagia não o afeta.',
  },
  {
    id: 'cura',
    name: 'Cura',
    tier: 5,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Uma criatura que você toca tem seus PV totalmente recuperados. Você não pode conjurar essa magia novamente até completar um descanso.',
  },
  {
    id: 'cura-em-massa',
    name: 'Cura em Massa',
    tier: 3,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Perto',
    description: 'Todos os aliados Perto de você recuperam 2d6 pontos de vida.',
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
    id: 'descanso-eterno',
    name: 'Descanso Eterno',
    tier: 3,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Você envia instantaneamente uma criatura morta-viva que você toca para o além-vida, destruindo-a permanentemente. O alvo pode ser uma criatura morta-viva de nível 9 ou menor.',
  },
  {
    id: 'desejo',
    name: 'Desejo',
    tier: 5,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Essa poderosa magia altera a realidade. Faça um único desejo, da forma mais clara e exata possível; ele se torna realidade conforme a interpretação do MJ. A falha no teste de conjuração é considerada crítica — role a falha mágica com Desvantagem.',
  },
  {
    id: 'desintegrar',
    name: 'Desintegrar',
    tier: 5,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Longe',
    description:
      'Seu dedo dispara um raio verde que transforma uma criatura ou objeto em cinzas. Um alvo de nível 5 ou menor morre instantaneamente; nível 6+ sofre 3d8 de dano. Um objeto não mágico até o tamanho de uma árvore grande é destruído.',
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
    id: 'dissipar-magia',
    name: 'Dissipar Magia',
    tier: 3,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Encerra uma magia que afeta um alvo que você possa ver e que esteja dentro do alcance.',
  },
  {
    id: 'dominios',
    name: 'Domínios',
    tier: 5,
    classes: ['sacerdote'],
    duration: '10 rodadas',
    range: 'Perto',
    description:
      'Seres poderosos surgem para ajudá-lo; o nível total combinado deve ser 16 ou menos. PJs caóticos invocam demônios/diabos; ordeiros ou neutros invocam anjos. Eles agem por vontade própria para ajudá-lo e, após 10 rodadas, retornam. Não pode conjurar novamente até completar uma penitência.',
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
    id: 'esfera-resiliente',
    name: 'Esfera Resiliente',
    tier: 4,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Adjacente',
    description:
      'Você conjura uma esfera sem peso e com aspecto vítreo ao seu redor, que se estende até a distância Adjacente. Enquanto durar, nada atravessa ou quebra a esfera. Você pode rolá-la o equivalente à distância Perto durante o seu turno.',
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
    id: 'expulsar-profano',
    name: 'Expulsar Profano',
    tier: 3,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Você repele criaturas opostas ao seu alinhamento, apresentando um símbolo sagrado. Ordeiro/neutro afeta demônios, diabos e Entidades Exteriores; caótico afeta anjos e criaturas do meio natural. Afetados Perto fazem teste de Carisma vs. seu teste de conjuração — falha por 10+ e nível ≤ o seu: destruído; falha por menos: foge por 5 rodadas.',
  },
  {
    id: 'fabricar',
    name: 'Fabricar',
    tier: 3,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Perto',
    description:
      'Criaturas não podem ser alvos. Você transforma um conjunto de matérias-primas, do tamanho de uma árvore, em um trabalho finalizado (ex.: tijolos em uma ponte). Ao fim da magia, o trabalho volta a ser matéria-prima.',
  },
  {
    id: 'falar-com-mortos',
    name: 'Falar com Mortos',
    tier: 3,
    classes: ['mago', 'sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Um cadáver que você toca responde às suas perguntas com voz distante e sibilante. Faça até três perguntas de "sim" ou "não" (uma por vez); o MJ responde honestamente. Conjurar mais de uma vez em 24 horas faz uma falha contar como falha crítica.',
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
    id: 'forma-gasosa',
    name: 'Forma Gasosa',
    tier: 3,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Pessoal',
    description:
      'Você e seus equipamentos se transformam em uma nuvem de fumaça. Você pode voar e atravessar qualquer abertura que fumaça atravessaria, e sentir o terreno e movimentos Perto. Não pode conjurar magias nessa forma.',
  },
  {
    id: 'ilusao',
    name: 'Ilusão',
    tier: 3,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Longe',
    description:
      'Você cria uma ilusão convincente, audível e visível, em um cubo de tamanho Perto ou menor, dentro do alcance. A ilusão não causa dano, mas quem acredita reage como se fosse real. Investigá-la de longe exige sucesso em teste de Sabedoria vs. seu teste de conjuração; tocá-la revela sua falsidade.',
  },
  {
    id: 'imobilizar-monstro',
    name: 'Imobilizar Monstro',
    tier: 5,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você paralisa uma criatura que você possa ver e que esteja dentro do alcance. Se o alvo for de nível 9+, pode fazer um teste de Força contra seu último teste de conjuração no início do turno para encerrar a magia.',
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
    id: 'invocar-extraplanar',
    name: 'Invocar Extraplanar',
    tier: 5,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você acessa os planos exteriores e invoca um elemental ou Entidade Exterior de nível 7 ou menor. A criatura fica sob seu controle e age em seu turno. Se a concentração falhar, ela se torna hostil. Você deve ter sucesso em um teste de conjuração em seu turno para fazê-la retornar.',
  },
  {
    id: 'ira',
    name: 'Ira',
    tier: 4,
    classes: ['sacerdote'],
    duration: '10 rodadas',
    range: 'Pessoal',
    description:
      'Suas armas se tornam mágicas (+2) e causam 1d8 de dano adicional enquanto a magia durar.',
  },
  {
    id: 'julgamento',
    name: 'Julgamento',
    tier: 5,
    classes: ['sacerdote'],
    duration: '5 rodadas',
    range: 'Adjacente',
    description:
      'Você bane uma criatura que você toca (de nível 10 ou menor), com seus pertences, para enfrentar o julgamento do seu deus. Ao retornar, após 5 rodadas: PV totalmente curados se agradou ao deus; PV reduzidos a 1 se o enfureceu; sem alteração se o deus não puder julgá-la.',
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
    id: 'metamorfose',
    name: 'Metamorfose',
    tier: 5,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Pessoal',
    description:
      'Você se transforma, junto com seu equipamento, em outra criatura natural que já viu e de nível 10 ou menor. Assume as características e atributos físicos dela, mas mantém os não físicos (INT, SAB, CAR). Se chegar a 0 PV sob o efeito, retorna à sua forma verdadeira com 1 PV.',
  },
  {
    id: 'muralha-de-energia',
    name: 'Muralha de Energia',
    tier: 4,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Perto',
    description:
      'Você conjura uma muralha de energia transparente, fina, em contato com uma superfície, cobrindo uma área de tamanho Perto em largura e comprimento (você escolhe o formato). Nada no mesmo plano pode atravessá-la fisicamente.',
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
    id: 'nevoa-mortal',
    name: 'Névoa Mortal',
    tier: 4,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Longe',
    description:
      'Uma nuvem de veneno amarelado preenche um cubo de tamanho Perto dentro do alcance. Criaturas dentro ficam cegas e sofrem 2d6 de dano no início de seus turnos. Uma criatura de nível 9 ou menor que encerrar o turno totalmente imersa morrerá.',
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
    id: 'olho-arcano',
    name: 'Olho Arcano',
    tier: 4,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Você conjura um olho invisível, do tamanho de uma uva, dentro do alcance. Você enxerga através dele. Ele vê no escuro até Perto, voa até Perto em seu turno e se espreme por aberturas tão estreitas quanto o buraco de uma fechadura.',
  },
  {
    id: 'orbe-prismatico',
    name: 'Orbe Prismático',
    tier: 5,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Longe',
    description:
      'Você envia um orbe estroboscópico de energia a um alvo dentro do alcance. Escolha fogo, frio ou eletricidade. O orbe causa 3d8 de dano e uma explosão concussiva do tipo escolhido. Se o tipo for contrário à natureza do alvo, causa o dobro de dano.',
  },
  {
    id: 'palavra-de-poder-matar',
    name: 'Palavra de Poder: Matar',
    tier: 5,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Perto',
    description:
      'Você profere a Palavra da Perdição. Uma criatura-alvo de nível 9 ou menor morrerá se puder ouvi-lo. A falha no teste de conjuração é considerada crítica — role a falha mágica com Desvantagem.',
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
    id: 'pele-rocha',
    name: 'Pele-Rocha',
    tier: 4,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Pessoal',
    description:
      'Sua pele se torna semelhante a granito. Enquanto a magia durar, sua CA se torna 17 (ou 20, em um sucesso crítico no teste de conjuração).',
  },
  {
    id: 'pilar-de-sal',
    name: 'Pilar de Sal',
    tier: 4,
    classes: ['sacerdote'],
    duration: 'concentração',
    range: 'Perto',
    description:
      'Uma criatura-alvo (nível 5 ou menor, que você possa ver) se torna uma estátua de sal endurecido. Se você mantiver a concentração por 3 rodadas seguidas, a transformação se torna permanente.',
  },
  {
    id: 'polimorfia',
    name: 'Polimorfia',
    tier: 4,
    classes: ['mago'],
    duration: '10 rodadas',
    range: 'Adjacente',
    description:
      'Você transforma uma criatura que você toca em outra criatura natural de tamanho igual ou menor. O equipamento se mescla à nova forma. O alvo ganha características/atributos físicos da criatura, mas retém os não físicos. A 0 PV, retorna à forma verdadeira com metade dos PV anteriores. Involuntária só se nível ≤ metade do seu (mín. 1).',
  },
  {
    id: 'porta-dimensional',
    name: 'Porta Dimensional',
    tier: 4,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Você teleporta a si mesmo, e até uma outra criatura voluntária Adjacente, para qualquer lugar que você possa ver.',
  },
  {
    id: 'pressagio',
    name: 'Presságio',
    tier: 4,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Você lança ossos divinatórios ou espia a escuridão entre as estrelas. Faça uma pergunta de "sim" ou "não" ao MJ, que responde honestamente. Conjurar mais de uma vez em 24 horas faz uma falha contar como falha crítica.',
  },
  {
    id: 'profecia',
    name: 'Profecia',
    tier: 5,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Pessoal',
    description:
      'Você entra em comunhão direta com seu deus em busca de direcionamento. Faça uma pergunta ao MJ; ele responde honestamente conforme o conhecimento do deus (poderosos, mas não oniscientes). Não pode conjurar novamente até completar uma penitência.',
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
    id: 'protecao-contra-energia',
    name: 'Proteção Contra Energia',
    tier: 3,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Adjacente',
    description:
      'Uma criatura que você toca se torna imune à fúria dos elementos. Escolha eletricidade, fogo ou frio; enquanto durar, o alvo é imune a danos desse tipo de energia.',
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
    id: 'regeneracao',
    name: 'Regeneração',
    tier: 4,
    classes: ['sacerdote'],
    duration: 'concentração',
    range: 'Adjacente',
    description:
      'Uma criatura que você toca recupera 1d4 pontos de vida em seu turno, enquanto a magia durar. Também faz crescer partes do corpo que foram perdidas.',
  },
  {
    id: 'relampago',
    name: 'Relâmpago',
    tier: 3,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Longe',
    description:
      'Você dispara um raio branco-azulado a partir de suas mãos, atingindo todas as criaturas em linha reta até o alcance da magia. As atingidas sofrem 3d6 de dano.',
  },
  {
    id: 'remeter',
    name: 'Remeter',
    tier: 3,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Ilimitado',
    description:
      'Você envia mentalmente uma mensagem curta para qualquer criatura que lhe seja familiar e que esteja no mesmo plano que você.',
  },
  {
    id: 'restauracao',
    name: 'Restauração',
    tier: 3,
    classes: ['sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Com o toque de suas mãos, você expurga maldições e doenças. À sua escolha, encerra uma maldição, doença ou moléstia que esteja afetando o alvo.',
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
    id: 'telecinese',
    name: 'Telecinese',
    tier: 4,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Longe',
    description:
      'Você ergue uma criatura ou objeto com sua mente. Escolha um alvo que pese 450 quilos ou menos. Pode movê-lo uma distância Perto, em qualquer direção, e mantê-lo no lugar.',
  },
  {
    id: 'teleporte',
    name: 'Teleporte',
    tier: 5,
    classes: ['mago'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Você e quaisquer criaturas voluntárias Adjacentes se teleportam para um local que você escolher, no mesmo plano. Pode ir a um sigilo de teleporte conhecido ou a um local já visitado; caso contrário, há 50% de chance de surgir fora do local pretendido.',
  },
  {
    id: 'transicao-planar',
    name: 'Transição Planar',
    tier: 5,
    classes: ['mago', 'sacerdote'],
    duration: 'instantânea',
    range: 'Adjacente',
    description:
      'Você dobra o espaço e o tempo, transportando a si mesmo e a todas as criaturas Adjacentes e voluntárias para um local em outro plano, à sua escolha. Se nunca visitou o local, surge em um lugar aleatório no plano de destino.',
  },
  {
    id: 'videncia',
    name: 'Vidência',
    tier: 5,
    classes: ['mago'],
    duration: 'concentração',
    range: 'Pessoal',
    description:
      'Você observa através de uma bola de cristal ou espelho d\'água, invocando imagens de um lugar distante. Pode ver e ouvir uma criatura ou local à sua escolha no mesmo plano. CD 18 se o alvo não for familiar. A cada rodada, criaturas observadas fazem teste de SAB vs. seu teste de conjuração; com sucesso, percebem a observação.',
  },
  {
    id: 'vinganca-divina',
    name: 'Vingança Divina',
    tier: 5,
    classes: ['sacerdote'],
    duration: '10 rodadas',
    range: 'Pessoal',
    description:
      'Você se torna o avatar da ira de seu deus, envolto em chamas sagradas ou aura de corrupção. Enquanto durar, pode voar até Perto, suas armas se tornam mágicas e você tem +4 em ataques e dano de sua arma.',
  },
  {
    id: 'voo',
    name: 'Voo',
    tier: 3,
    classes: ['mago'],
    duration: '5 rodadas',
    range: 'Pessoal',
    description:
      'Seus pés se erguem do solo e você se eleva no ar como um pássaro. Pode voar por até Perto enquanto a magia durar, e também pairar sobre o mesmo lugar.',
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
