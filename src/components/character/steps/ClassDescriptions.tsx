import { Flex, Text, Box } from '@chakra-ui/react';

export const GuerreiroTalents = [
  { roll: '2', effect: 'Ganhe Maestria em Armas em um tipo de arma adicional.' },
  { roll: '3 a 6', effect: '+1 ponto em ataques corpo a corpo e à distância.' },
  { roll: '7 a 9', effect: '+2 pontos no atributo Força, Destreza ou Constituição.' },
  { roll: '10 a 11', effect: 'Escolha um tipo de armadura e receba +1 na CA ao usá-la.' },
  { roll: '12', effect: 'Escolha um talento ou distribua +2 pontos entre os seus atributos.' },
];

export const LadraoTalents = [
  { roll: '2', effect: 'Ganhe vantagem nas rolagens de iniciativa.' },
  { roll: '3 a 6', effect: '+1 nos testes de talento de ladrão (Ladinagem/Furtividade).' },
  { roll: '7 a 9', effect: '+2 pontos no atributo Destreza ou Carisma.' },
  { roll: '10 a 11', effect: '+1 ponto em ataques corpo a corpo e à distância.' },
  { roll: '12', effect: 'Escolha um talento ou distribua +2 pontos entre os seus atributos.' },
];

export const SacerdoteTalents = [
  { roll: '2', effect: 'Ganhe vantagem nas rolagens de conjuração para uma magia à sua escolha.' },
  { roll: '3 a 6', effect: '+1 ponto em ataques mágicos ou corpo a corpo.' },
  { roll: '7 a 9', effect: '+2 pontos no atributo Força ou Sabedoria.' },
  { roll: '10 a 11', effect: '+1 nas rolagens de curas mágicas.' },
  { roll: '12', effect: 'Escolha um talento ou distribua +2 pontos entre os seus atributos.' },
];

export const MagoTalents = [
  { roll: '2', effect: 'Aprenda uma nova magia de qualquer círculo que possa lançar.' },
  { roll: '3 a 6', effect: '+1 nas rolagens de conjuração mágica.' },
  { roll: '7 a 9', effect: '+2 pontos no atributo Inteligência ou Destreza.' },
  { roll: '10 a 11', effect: 'Ganhe vantagem para conjurar magias de um elemento/tema específico.' },
  { roll: '12', effect: 'Escolha um talento ou distribua +2 pontos entre os seus atributos.' },
];

export const GuerreiroDescription = (
  <Flex direction="column" gap="1rem" fontSize="sm" color="fg.muted">
    <Text>
      A classe <Text as="strong" color="fg.default">Guerreiro</Text> no Shadowdark é ideal para jogadores que buscam excelência marcial, resistência e versatilidade em combate. Eles são descritos como "gladiadores ensanguentados usando armaduras amassadas, duelistas acrobáticos com suas espadas de arremesso, ou arqueiros élficos de visão aguçada que forjam suas lendas com aço e coragem".
    </Text>

    <Text>
      Para ajudar na sua decisão de escolher ou não esta classe para o seu próximo aventureiro, detalhei abaixo suas características, habilidades e qual é o seu papel no grupo.
    </Text>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Características Básicas</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }}>
        <li><Text as="strong" color="fg.default">Atributo Principal:</Text> O atributo mais importante para um guerreiro costuma ser a Força (utilizada para atacar com armas corpo a corpo e abrir portas à força), mas a Destreza e a Constituição também são cruciais;</li>
        <li><Text as="strong" color="fg.default">Pontos de Vida (PV):</Text> Eles ganham 1d8 PV por nível, o que os torna uma das classes mais resistentes do jogo;</li>
        <li><Text as="strong" color="fg.default">Equipamento:</Text> Diferente de outras classes, os guerreiros não possuem restrições. Eles podem usar todas as armas, todas as armaduras e escudos.</li>
      </Box>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Habilidades Exclusivas</Text>
      <Text mb="0.5rem">A classe oferece três grandes benefícios mecânicos que a tornam formidável na exploração e sobrevivência:</Text>
      <Flex direction="column" gap="0.5rem">
        <Text><Text as="strong" color="fg.default">1. Maestria em Armas:</Text> O guerreiro escolhe um tipo específico de arma (como uma espada longa ou um arco) e recebe +1 em todas as jogadas de ataque e dano com ela. Além disso, o personagem adiciona metade do seu nível (arredondado para baixo) a essas rolagens, garantindo que o dano escale muito bem durante a campanha.</Text>
        <Text><Text as="strong" color="fg.default">2. Bravura:</Text> Você escolhe focar em Força ou Destreza e ganha Vantagem em testes desse atributo quando for superar uma força oposta. Isso significa que chutar portas emperradas (Força) ou escapar de correntes e armadilhas físicas (Destreza) se torna muito mais fácil.</Text>
        <Text><Text as="strong" color="fg.default">3. Carregador:</Text> No Shadowdark, a limitação de inventário é severa, mas o guerreiro pode adicionar o seu modificador de Constituição aos seus espaços de equipamento livres. Isso permite carregar armaduras pesadas, várias armas e ainda ter espaço para os preciosos tesouros encontrados nas masmorras.</Text>
      </Flex>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Progressão e Talentos</Text>
      <Text mb="0.5rem">Ao avançar de nível, em vez de escolher habilidades de uma lista extensa, você rola 2d6 na tabela de Talentos de Guerreiro. Isso pode garantir bônus agressivos ou defensivos, como:</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }} mb="0.5rem">
        <li>Mais especializações em novos tipos de armas;</li>
        <li>Bônus numéricos em ataques corpo a corpo e à distância;</li>
        <li>Aumento direto nos atributos de Força, Destreza ou Constituição;</li>
        <li>Bônus de +1 na Classe de Armadura (CA) ao usar um tipo específico de armadura.</li>
      </Box>
      <Text>Conforme ganha fama no mundo, o guerreiro recebe novos títulos baseados em seu alinhamento. Um guerreiro Ordeiro pode ser chamado de "Escudeiro" no nível 1 e evoluir até "Lorde/Dama"; já um guerreiro Caótico começa como "Valete" e pode se tornar um "Senhor da Guerra".</Text>
    </Box>
  </Flex>
);

export const LadraoDescription = (
  <Flex direction="column" gap="1rem" fontSize="sm" color="fg.muted">
    <Text>
      A classe <Text as="strong" color="fg.default">Ladrão</Text> no Shadowdark é voltada para jogadores que preferem agir nas sombras, usar a astúcia e resolver problemas com precisão, furtividade e lábia, em vez de força bruta. O manual os descreve como "assassinos que se esgueiram por telhados, vigaristas sorridentes ou escaladores encapuzados que podem arrancar uma pedra preciosa das garras de um demônio adormecido e vendê-la pelo dobro de seu preço".
    </Text>

    <Text>
      Para ajudar na sua decisão de escolher ou não esta classe, detalhei abaixo suas características, habilidades e qual é o seu papel estratégico no grupo.
    </Text>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Características Básicas</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }}>
        <li><Text as="strong" color="fg.default">Atributo Principal:</Text> A Destreza é o atributo mais importante, pois é fundamental para atirar com arcos, equilibrar-se, esconder-se e usar suas habilidades furtivas. O Carisma também é útil para enganar e interagir, atributos frequentemente aprimorados em sua progressão;</li>
        <li><Text as="strong" color="fg.default">Pontos de Vida (PV):</Text> Eles ganham 1d4 PV por nível, o que os torna frágeis e vulneráveis em combates diretos e prolongados.</li>
        <li><Text as="strong" color="fg.default">Equipamento:</Text> Diferente do guerreiro, os ladrões são restritos a armas e armaduras leves para não prejudicar sua mobilidade. Podem usar armaduras de couro ou cota de malha de mitral e armas como adagas, arcos curtos, bestas, clavas e espadas curtas.</li>
      </Box>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Habilidades Exclusivas</Text>
      <Text mb="0.5rem">A utilidade do ladrão brilha através de suas habilidades únicas focadas em exploração e eliminação rápida:</Text>
      <Flex direction="column" gap="0.5rem">
        <Text><Text as="strong" color="fg.default">1. Ladroagem:</Text> Você possui proficiência em habilidades de roubo e as ferramentas necessárias vêm escondidas com você (sem ocupar espaços preciosos de equipamento). O ladrão ganha Vantagem em qualquer teste para:</Text>
        <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }}>
          <li>Escalar;</li>
          <li>Esgueirar-se e esconder-se;</li>
          <li>Usar disfarces;</li>
          <li>Encontrar e desarmar armadilhas;</li>
          <li>Realizar tarefas delicadas, como bater carteiras e abrir fechaduras;</li>
        </Box>
        <Text><Text as="strong" color="fg.default">2. Apunhalada Pelas Costas:</Text> A letalidade do ladrão surge quando ele pega o inimigo desprevenido. Se acertar uma criatura que não esteja ciente do ataque, o ladrão causa dano extra com o dado da arma, adicionando uma quantidade de dados extras equivalente à metade do seu nível (arredondado para baixo).</Text>
      </Flex>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Progressão e Talentos</Text>
      <Text mb="0.5rem">Ao avançar de nível, o ladrão rola 2d6 na sua tabela de Talentos de Ladrão. Esses avanços o tornam ainda mais mortal e rápido, podendo garantir:</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }} mb="0.5rem">
        <li>Vantagem nas rolagens de iniciativa (permitindo agir antes dos monstros);</li>
        <li>Um dado extra de dano (+1) na sua Apunhalada Pelas Costas;</li>
        <li>Bônus de +2 em atributos chave (Força, Destreza ou Carisma);</li>
        <li>Bônus numéricos (+1) em ataques corpo a corpo e à distância.</li>
      </Box>
      <Text>Com o crescimento da sua fama e nível, seu título se adapta. Um Ladrão Ordeiro pode começar como "Malandro" e ascender a "Chefe" no nível 10; um Caótico evolui de "Rufião" para "Fantasma", enquanto um Neutro passa de "Bandoleiro" para "Rei/Rainha dos Bandidos".</Text>
    </Box>
  </Flex>
);

export const SacerdoteDescription = (
  <Flex direction="column" gap="1rem" fontSize="sm" color="fg.muted">
    <Text>
      A classe <Text as="strong" color="fg.default">Sacerdote</Text> no Shadowdark é voltada para jogadores que desejam ser o pilar espiritual e de suporte do grupo, sem abrir mão da resistência física. Eles são descritos no manual como "templários cruzados, xamãs proféticos, ou fanáticos com olhos enlouquecidos que empunham o poder de seus deuses para expurgar os impuros".
    </Text>

    <Text>
      Para ajudar na sua decisão de escolher ou não esta classe, detalhei abaixo suas características, a mecânica única de sua magia e qual é o seu papel estratégico.
    </Text>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Características Básicas</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }}>
        <li><Text as="strong" color="fg.default">Atributo Principal:</Text> A Sabedoria é o atributo essencial, pois é utilizada para conjurar magias, detectar o oculto e reconhecer presságios. A Força também é muito útil para ataques físicos;</li>
        <li><Text as="strong" color="fg.default">Pontos de Vida (PV):</Text> Eles ganham 1d6 PV por nível;</li>
        <li><Text as="strong" color="fg.default">Equipamento:</Text> Diferente dos magos, os sacerdotes são combatentes da linha de frente. Eles podem usar todas as armaduras e escudos, e têm acesso a armas como adaga, besta, cajado, clava, espada longa, maça e martelo de guerra;</li>
        <li><Text as="strong" color="fg.default">Idiomas:</Text> Seu vínculo divino permite que conheçam um idioma místico à sua escolha: Celestial, Diabólico ou Primordial.</li>
      </Box>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Habilidades Exclusivas e Magia</Text>
      <Text mb="0.5rem">A magia dos sacerdotes é sagrada, milagrosa e instintiva. Eles iniciam com os seguintes benefícios únicos:</Text>
      <Flex direction="column" gap="0.5rem">
        <Text><Text as="strong" color="fg.default">1. Divindade e Penitência:</Text> Você deve escolher servir fielmente a um deus com o mesmo alinhamento que o seu. No entanto, se você falhar na conjuração de uma magia, sua divindade fica descontente e revoga o seu poder. Você não poderá conjurar essa magia novamente até completar um descanso e realizar uma penitência (uma missão, sacrifício financeiro ou rito de expiação estipulado pelo Mestre);</Text>
        <Text><Text as="strong" color="fg.default">2. Conjuração Divina:</Text> O sacerdote usa Sabedoria para conjurar milagres de cura, proteção e auxílio. No nível 1, ele escolhe duas magias de grau 1 para conhecer;</Text>
        <Text><Text as="strong" color="fg.default">3. Expulsar Mortos-Vivos:</Text> Todo sacerdote conhece a magia expulsar mortos-vivos gratuitamente, sem ocupar o seu limite de magias conhecidas. Com ela, apresentando seu símbolo sagrado, ele pode forçar mortos-vivos próximos a fugirem ou até mesmo destruí-los instantaneamente se a rolagem for alta o suficiente.</Text>
      </Flex>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Progressão e Talentos</Text>
      <Text mb="0.5rem">Ao avançar de nível, o sacerdote rola 2d6 em sua tabela de Talentos de Sacerdote, o que pode aprimorar tanto seu lado conjurador quanto o marcial. Você pode ganhar:</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }} mb="0.5rem">
        <li>Vantagem na conjuração de uma magia que já conhece;</li>
        <li>Bônus (+1) em testes de conjuração de magias de sacerdote;</li>
        <li>Bônus (+1) em ataques corpo a corpo ou à distância;</li>
        <li>Aumento de +2 no atributo Força ou Sabedoria.</li>
      </Box>
      <Text>Com o ganho de níveis, os sacerdotes recebem títulos baseados em seu alinhamento. Um sacerdote Ordeiro evolui de "Acólito" para "Paladino" (nível 9-10). Um Caótico vai de "Iniciado" a "Cavaleiro do Caos", e um Neutro de "Rastreador" para "Oráculo".</Text>
    </Box>
  </Flex>
);

export const MagoDescription = (
  <Flex direction="column" gap="1rem" fontSize="sm" color="fg.muted">
    <Text>
      A classe <Text as="strong" color="fg.default">Mago</Text> no Shadowdark é a personificação do conceito de "alto risco, alta recompensa", ideal para jogadores que desejam controlar os elementos, alterar a realidade e não se importam em flertar constantemente com o perigo. Eles são descritos como "adeptos tatuados com runas, sábios usando óculos, e bruxas conjuradoras de chamas que ousam manipular as terríveis forças da magia". Enquanto guerreiros e sacerdotes brilham no combate físico, o foco principal dos magos é "dominar o ambiente ao redor deles".
    </Text>

    <Text>
      Para ajudar na sua decisão de escolher ou não esta classe, detalhei abaixo suas características, a natureza caótica de sua magia e qual é o seu papel estratégico no grupo.
    </Text>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Características Básicas</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }}>
        <li><Text as="strong" color="fg.default">Atributo Principal:</Text> A Inteligência é o atributo fundamental, pois é o modificador somado às suas rolagens de conjuração para definir se uma magia funcionou ou não;</li>
        <li><Text as="strong" color="fg.default">Pontos de Vida (PV):</Text> Eles ganham apenas 1d4 PV por nível, o que os torna a classe mais frágil fisicamente do jogo;</li>
        <li><Text as="strong" color="fg.default">Equipamento:</Text> Suas restrições são severas. Os magos não podem usar nenhuma armadura e estão limitados a empunhar apenas adagas e cajados;</li>
        <li><Text as="strong" color="fg.default">Idiomas:</Text> Devido aos seus longos anos de estudo, eles iniciam o jogo conhecendo dois idiomas comuns adicionais e dois idiomas raros.</li>
      </Box>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Habilidades Exclusivas e Magia</Text>
      <Text mb="0.5rem">A magia dos magos é "instável, complicada e volátil". Eles possuem vantagens incríveis, mas com riscos igualmente devastadores:</Text>
      <Flex direction="column" gap="0.5rem">
        <Text><Text as="strong" color="fg.default">1. Conjuração Arcana:</Text> O mago conhece três magias de grau 1 logo no primeiro nível. Eles usam feitiços que causam dano em área (como Mãos Flamejantes), utilidade profunda (como Disco Flutuante e Queda Suave) ou controle (como Sono);</Text>
        <Text><Text as="strong" color="fg.default">2. Aprendendo Magias (Pergaminhos):</Text> Diferente das outras classes, o mago pode expandir seu arsenal de forma ilimitada. Ao encontrar um pergaminho mágico, ele pode estudá-lo por um dia e tentar um teste de Inteligência (CD 15); em caso de sucesso, ele aprende aquela magia permanentemente, sem que ela conte no seu limite de magias conhecidas da classe;</Text>
        <Text><Text as="strong" color="fg.default">3. O Risco das Falhas Mágicas:</Text> Conjurar magias arcanas é perigoso. Se você obtiver um 1 natural no dado de conjuração, você não apenas falha, mas sofre uma Falha Mágica de Mago. Você deverá rolar um 1d12 em uma tabela de desastres imprevisíveis que incluem explodir a si mesmo, perder itens para sempre, incapacitar-se mentalmente ou até mesmo atingir seus próprios aliados acidentalmente.</Text>
      </Flex>
    </Box>

    <Box>
      <Text fontWeight="bold" color="fg.default" mb="0.5rem">Progressão e Talentos</Text>
      <Text mb="0.5rem">Ao subir de nível, o mago rola 2d6 em sua tabela de Talentos de Mago, focando em expandir seu intelecto e poder místico. Os avanços incluem:</Text>
      <Box as="ul" pl="1.5rem" style={{ listStyleType: 'disc' }} mb="0.5rem">
        <li>Bônus de +2 em Inteligência ou +1 nos testes de conjuração de mago;</li>
        <li>Vantagem garantida para conjurar uma magia específica que você já conhece;</li>
        <li>Aprender uma nova magia instantaneamente de qualquer grau que você tenha acesso;</li>
        <li>A habilidade raríssima de criar um item mágico aleatório.</li>
      </Box>
      <Text>Conforme acumula fama e XP, seu título evolui. Um Mago Ordeiro começa como "Aprendiz" e pode se tornar um "Arquimago" no nível 10; os Caóticos vão de "Adepto" a "Feiticeiro", enquanto os de alinhamento Neutro vão de "Xamã" a "Druida".</Text>
    </Box>
  </Flex>
);
