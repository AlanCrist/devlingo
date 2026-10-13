import type {
  Exercise,
  LearningPath,
  Lesson,
  LearningModule,
  VocabularyItem,
} from '../domain/content-types'

const vocabulary = (
  lessonId: string,
  items: Array<[string, string, string, string]>,
): VocabularyItem[] =>
  items.map(([termEn, translationPt, explanationPt, exampleEn], index) => ({
    id: `${lessonId}-vocabulary-${index + 1}`,
    termEn,
    translationPt,
    explanationPt,
    exampleEn,
  }))

const multipleChoice = (
  id: string,
  promptEn: string,
  promptPt: string,
  options: Array<[string, string, string]>,
  correctOptionId: string,
  explanationEn: string,
  explanationPt: string,
): Exercise => ({
  id,
  type: 'multiple-choice',
  prompt: { en: promptEn, pt: promptPt },
  options: options.map(([optionId, en, pt]) => ({
    id: optionId,
    label: { en, pt },
  })),
  correctOptionId,
  feedback: { explanation: { en: explanationEn, pt: explanationPt } },
})

const trueFalse = (
  id: string,
  promptEn: string,
  promptPt: string,
  correctOptionId: 'true' | 'false',
  explanationEn: string,
  explanationPt: string,
): Exercise => ({
  id,
  type: 'true-false',
  prompt: { en: promptEn, pt: promptPt },
  options: [
    { id: 'true', label: { en: 'True', pt: 'Verdadeiro' } },
    { id: 'false', label: { en: 'False', pt: 'Falso' } },
  ],
  correctOptionId,
  feedback: { explanation: { en: explanationEn, pt: explanationPt } },
})

const lesson = (
  moduleId: string,
  lessonId: string,
  order: number,
  titleEn: string,
  titlePt: string,
  explanationEn: string,
  explanationPt: string,
  contextEn: string,
  contextPt: string,
  lessonVocabulary: VocabularyItem[],
  exercises: Exercise[],
): Lesson => ({
  id: lessonId,
  moduleId,
  title: { en: titleEn, pt: titlePt },
  order,
  explanation: { en: explanationEn, pt: explanationPt },
  context: { en: contextEn, pt: contextPt },
  vocabulary: lessonVocabulary,
  exercises,
})

const module = (
  id: string,
  order: number,
  titleEn: string,
  titlePt: string,
  lessons: Lesson[],
): LearningModule => ({
  id,
  order,
  title: { en: titleEn, pt: titlePt },
  lessons,
})

const lessonOneExercises = (id: string): Exercise[] => [
  multipleChoice(
    `${id}-exercise-1`,
    'What does “fix a bug” mean?',
    'O que significa “fix a bug”?',
    [
      ['a', 'Find and correct a problem', 'Encontrar e corrigir um problema'],
      ['b', 'Create a new feature', 'Criar uma nova funcionalidade'],
      ['c', 'Delete the project', 'Excluir o projeto'],
    ],
    'a',
    'To fix a bug is to correct an unexpected problem in the software.',
    'Corrigir um bug é resolver um problema inesperado no software.',
  ),
  multipleChoice(
    `${id}-exercise-2`,
    'Which sentence describes a reproducible bug?',
    'Qual frase descreve um bug reproduzível?',
    [
      ['a', 'It happens only once', 'Ele acontece apenas uma vez'],
      [
        'b',
        'It can be observed again with the same steps',
        'Ele pode ser observado novamente com os mesmos passos',
      ],
      ['c', 'It has no visible effect', 'Ele não tem efeito visível'],
    ],
    'b',
    'A reproducible bug can be observed again by following the same steps.',
    'Um bug reproduzível pode ser observado novamente ao seguir os mesmos passos.',
  ),
  multipleChoice(
    `${id}-exercise-3`,
    'Choose the best report title: the page fails after clicking Save.',
    'Escolha o melhor título de relatório: a página falha após clicar em Save.',
    [
      [
        'a',
        'Save button causes a page error',
        'O botão Save causa um erro na página',
      ],
      ['b', 'Everything is broken', 'Tudo está quebrado'],
      ['c', 'Question', 'Pergunta'],
    ],
    'a',
    'A useful title is specific about the action and the observed problem.',
    'Um bom título é específico sobre a ação e o problema observado.',
  ),
  trueFalse(
    `${id}-exercise-4`,
    'A bug report should include steps to reproduce the problem.',
    'Um relatório de bug deve incluir os passos para reproduzir o problema.',
    'true',
    'Reproduction steps help another person observe and investigate the problem.',
    'Os passos de reprodução ajudam outra pessoa a observar e investigar o problema.',
  ),
  trueFalse(
    `${id}-exercise-5`,
    'The word “issue” can never mean a software problem.',
    'A palavra “issue” nunca pode significar um problema de software.',
    'false',
    'In a development context, “issue” can mean a reported problem or task.',
    'Em desenvolvimento, “issue” pode significar um problema ou tarefa registrada.',
  ),
]

const lessonTwoExercises = (id: string): Exercise[] => [
  multipleChoice(
    `${id}-exercise-1`,
    'What is a requirement?',
    'O que é um requisito?',
    [
      [
        'a',
        'A desired behavior or constraint',
        'Um comportamento ou restrição desejada',
      ],
      ['b', 'A random error message', 'Uma mensagem de erro aleatória'],
      ['c', 'A color palette only', 'Apenas uma paleta de cores'],
    ],
    'a',
    'A requirement describes what the product should do or what constraint it must follow.',
    'Um requisito descreve o que o produto deve fazer ou qual restrição deve seguir.',
  ),
  multipleChoice(
    `${id}-exercise-2`,
    'Which question clarifies an ambiguous requirement?',
    'Qual pergunta esclarece um requisito ambíguo?',
    [
      [
        'a',
        'What does “fast” mean in this context?',
        'O que “rápido” significa neste contexto?',
      ],
      ['b', 'Can we ignore the users?', 'Podemos ignorar os usuários?'],
      ['c', 'Should we remove all tests?', 'Devemos remover todos os testes?'],
    ],
    'a',
    'Asking for a measurable meaning makes an unclear requirement more precise.',
    'Perguntar por um significado mensurável torna um requisito pouco claro mais preciso.',
  ),
  multipleChoice(
    `${id}-exercise-3`,
    'Complete: “The system must ____ a confirmation message.”',
    'Complete: “The system must ____ a confirmation message.”',
    [
      ['a', 'display', 'exibir'],
      ['b', 'displayed', 'exibido'],
      ['c', 'displaying', 'exibindo'],
    ],
    'a',
    'After “must”, use the base form of the verb: “must display”.',
    'Depois de “must”, use a forma base do verbo: “must display”.',
  ),
  trueFalse(
    `${id}-exercise-4`,
    'A clear requirement can be checked with an observable result.',
    'Um requisito claro pode ser verificado com um resultado observável.',
    'true',
    'Observable results make it possible to verify whether a requirement is met.',
    'Resultados observáveis permitem verificar se um requisito foi atendido.',
  ),
  trueFalse(
    `${id}-exercise-5`,
    '“Maybe the app should be faster” is a precise requirement.',
    '“Maybe the app should be faster” é um requisito preciso.',
    'false',
    'The sentence is vague because it does not define a measurable expectation.',
    'A frase é vaga porque não define uma expectativa mensurável.',
  ),
]

const lessonThreeExercises = (id: string): Exercise[] => [
  multipleChoice(
    `${id}-exercise-1`,
    'What does “review the code” mean?',
    'O que significa “review the code”?',
    [
      [
        'a',
        'Inspect the code to find improvements or problems',
        'Inspecionar o código para encontrar melhorias ou problemas',
      ],
      ['b', 'Run the code without reading it', 'Executar o código sem lê-lo'],
      ['c', 'Rename every variable', 'Renomear todas as variáveis'],
    ],
    'a',
    'A code review is an inspection of code by one or more developers.',
    'Uma revisão de código é uma inspeção do código por um ou mais desenvolvedores.',
  ),
  multipleChoice(
    `${id}-exercise-2`,
    'Which comment is constructive?',
    'Qual comentário é construtivo?',
    [
      ['a', 'This is bad.', 'Isto está ruim.'],
      [
        'b',
        'Could we extract this repeated logic into a function?',
        'Podemos extrair esta lógica repetida para uma função?',
      ],
      ['c', 'You never write good code.', 'Você nunca escreve código bom.'],
    ],
    'b',
    'A constructive comment identifies an improvement and keeps the discussion about the code.',
    'Um comentário construtivo identifica uma melhoria e mantém a discussão sobre o código.',
  ),
  multipleChoice(
    `${id}-exercise-3`,
    'In a pull request, “approve” means:',
    'Em um pull request, “approve” significa:',
    [
      [
        'a',
        'Accept the changes for merging',
        'Aceitar as alterações para merge',
      ],
      ['b', 'Delete the changes', 'Excluir as alterações'],
      ['c', 'Pause the review forever', 'Pausar a revisão para sempre'],
    ],
    'a',
    'An approval indicates that the reviewer accepts the changes as ready to merge.',
    'Uma aprovação indica que o revisor considera as alterações prontas para merge.',
  ),
  trueFalse(
    `${id}-exercise-4`,
    'A code review comment should focus on the change and its impact.',
    'Um comentário de revisão deve focar na alteração e em seu impacto.',
    'true',
    'Focusing on the change makes technical collaboration clearer and more respectful.',
    'Focar na alteração torna a colaboração técnica mais clara e respeitosa.',
  ),
  trueFalse(
    `${id}-exercise-5`,
    '“Request changes” means that the reviewer has no feedback.',
    '“Request changes” significa que o revisor não tem feedback.',
    'false',
    'Requesting changes means that the author should address feedback before approval.',
    'Solicitar alterações significa que o autor deve tratar o feedback antes da aprovação.',
  ),
]

const lessonFourExercises = (id: string): Exercise[] => [
  multipleChoice(
    `${id}-exercise-1`,
    'What does “deploy” mean?',
    'O que significa “deploy”?',
    [
      [
        'a',
        'Release software to an environment',
        'Publicar software em um ambiente',
      ],
      ['b', 'Write a private note', 'Escrever uma nota privada'],
      ['c', 'Remove a requirement', 'Remover um requisito'],
    ],
    'a',
    'To deploy is to make a software version available in an environment.',
    'Fazer deploy é disponibilizar uma versão do software em um ambiente.',
  ),
  multipleChoice(
    `${id}-exercise-2`,
    'Which sentence reports a deployment problem clearly?',
    'Qual frase relata claramente um problema de deploy?',
    [
      [
        'a',
        'The deployment failed because the build could not find the configuration file.',
        'O deploy falhou porque o build não encontrou o arquivo de configuração.',
      ],
      ['b', 'It is broken.', 'Está quebrado.'],
      ['c', 'Something happened somewhere.', 'Algo aconteceu em algum lugar.'],
    ],
    'a',
    'A clear report names the action, the result, and the available cause.',
    'Um relato claro informa a ação, o resultado e a causa disponível.',
  ),
  multipleChoice(
    `${id}-exercise-3`,
    'What is a rollback?',
    'O que é um rollback?',
    [
      [
        'a',
        'A return to a previous version',
        'Um retorno para uma versão anterior',
      ],
      ['b', 'A new feature request', 'Uma nova solicitação de funcionalidade'],
      ['c', 'A user survey', 'Uma pesquisa com usuários'],
    ],
    'a',
    'A rollback restores a previous version when the current release has a problem.',
    'Um rollback restaura uma versão anterior quando a versão atual tem um problema.',
  ),
  trueFalse(
    `${id}-exercise-4`,
    'A deployment can target different environments, such as staging or production.',
    'Um deploy pode ter como destino ambientes diferentes, como staging ou produção.',
    'true',
    'Teams commonly use separate environments to validate software before production.',
    'As equipes normalmente usam ambientes separados para validar o software antes da produção.',
  ),
  trueFalse(
    `${id}-exercise-5`,
    'A rollback always creates a new feature.',
    'Um rollback sempre cria uma nova funcionalidade.',
    'false',
    'A rollback changes the deployed version back; it does not create a feature.',
    'Um rollback muda a versão publicada para uma anterior; não cria uma funcionalidade.',
  ),
]

const lessonFiveExercises = (id: string): Exercise[] => [
  multipleChoice(
    `${id}-exercise-1`,
    'What is useful in a technical documentation page?',
    'O que é útil em uma página de documentação técnica?',
    [
      [
        'a',
        'A clear example of the expected usage',
        'Um exemplo claro do uso esperado',
      ],
      ['b', 'Only a title', 'Apenas um título'],
      ['c', 'An unrelated advertisement', 'Um anúncio não relacionado'],
    ],
    'a',
    'Examples connect an abstract explanation to a practical use case.',
    'Exemplos conectam uma explicação abstrata a um caso de uso prático.',
  ),
  multipleChoice(
    `${id}-exercise-2`,
    'In documentation, “prerequisite” means:',
    'Na documentação, “prerequisite” significa:',
    [
      [
        'a',
        'Something required before starting',
        'Algo necessário antes de começar',
      ],
      ['b', 'A final result', 'Um resultado final'],
      ['c', 'An optional joke', 'Uma piada opcional'],
    ],
    'a',
    'A prerequisite is a condition or resource needed before following the instructions.',
    'Um pré-requisito é uma condição ou recurso necessário antes de seguir as instruções.',
  ),
  multipleChoice(
    `${id}-exercise-3`,
    'Which instruction is the clearest?',
    'Qual instrução é mais clara?',
    [
      [
        'a',
        'Run the command, then check the output.',
        'Execute o comando e depois verifique a saída.',
      ],
      ['b', 'Do the usual thing.', 'Faça o de sempre.'],
      ['c', 'Handle it somehow.', 'Resolva de algum jeito.'],
    ],
    'a',
    'A clear instruction uses a specific action and an observable next step.',
    'Uma instrução clara usa uma ação específica e um próximo passo observável.',
  ),
  trueFalse(
    `${id}-exercise-4`,
    'A documentation example should match the explanation around it.',
    'Um exemplo de documentação deve corresponder à explicação ao seu redor.',
    'true',
    'A consistent example helps the reader apply the documented concept.',
    'Um exemplo consistente ajuda o leitor a aplicar o conceito documentado.',
  ),
  trueFalse(
    `${id}-exercise-5`,
    'A prerequisite is always optional.',
    'Um pré-requisito é sempre opcional.',
    'false',
    'A prerequisite is something needed before the main steps; it is not necessarily optional.',
    'Um pré-requisito é algo necessário antes dos passos principais; não é necessariamente opcional.',
  ),
]

const lessonSixExercises = (id: string): Exercise[] => [
  multipleChoice(
    `${id}-exercise-1`,
    'Which phrase is best for a concise status update?',
    'Qual frase é melhor para uma atualização de status concisa?',
    [
      [
        'a',
        'I finished the fix and I am testing it now.',
        'Terminei a correção e estou testando agora.',
      ],
      [
        'b',
        'Things are kind of happening.',
        'As coisas estão meio que acontecendo.',
      ],
      ['c', 'No information.', 'Nenhuma informação.'],
    ],
    'a',
    'The sentence clearly communicates completed work and the current next step.',
    'A frase comunica claramente o trabalho concluído e o próximo passo atual.',
  ),
  multipleChoice(
    `${id}-exercise-2`,
    'What does “I am blocked” communicate?',
    'O que “I am blocked” comunica?',
    [
      [
        'a',
        'Progress cannot continue because of an impediment',
        'O progresso não pode continuar por causa de um impedimento',
      ],
      ['b', 'The work is complete', 'O trabalho está concluído'],
      [
        'c',
        'The meeting is cancelled forever',
        'A reunião foi cancelada para sempre',
      ],
    ],
    'a',
    'Being blocked means that something prevents the person from continuing the work.',
    'Estar bloqueado significa que algo impede a pessoa de continuar o trabalho.',
  ),
  multipleChoice(
    `${id}-exercise-3`,
    'Which request is polite and specific?',
    'Qual solicitação é educada e específica?',
    [
      [
        'a',
        'Could you review the error logs before the meeting?',
        'Você poderia revisar os logs de erro antes da reunião?',
      ],
      ['b', 'Do it.', 'Faça isso.'],
      ['c', 'You should know.', 'Você deveria saber.'],
    ],
    'a',
    'A polite request uses “Could you” and identifies the action and timeframe.',
    'Uma solicitação educada usa “Could you” e identifica a ação e o prazo.',
  ),
  trueFalse(
    `${id}-exercise-4`,
    'A status update is clearer when it separates completed work from next steps.',
    'Uma atualização de status é mais clara quando separa o trabalho concluído dos próximos passos.',
    'true',
    'Separating status and next steps makes the message easier to scan.',
    'Separar o status dos próximos passos torna a mensagem mais fácil de consultar.',
  ),
  trueFalse(
    `${id}-exercise-5`,
    '“I need help with this” clearly identifies the exact blocker.',
    '“I need help with this” identifica claramente o bloqueio exato.',
    'false',
    'The request is understandable but does not explain what the blocker is.',
    'A solicitação é compreensível, mas não explica qual é o bloqueio.',
  ),
]

const moduleOneLessons = [
  lesson(
    'module-1',
    'lesson-1',
    1,
    'Talking about bugs',
    'Falando sobre bugs',
    'Learn common words for describing software problems and their reproduction steps.',
    'Aprenda palavras comuns para descrever problemas de software e seus passos de reprodução.',
    'A developer reports that the checkout page fails after a user submits an order. The report includes the browser, the steps, and the observed error.',
    'Uma pessoa desenvolvedora relata que a página de checkout falha depois que alguém envia um pedido. O relato inclui o navegador, os passos e o erro observado.',
    vocabulary('lesson-1', [
      [
        'bug',
        'bug / defeito',
        'Um problema inesperado no software.',
        'The team fixed a bug in the checkout flow.',
      ],
      [
        'issue',
        'problema / tarefa',
        'Um problema ou tarefa registrada para acompanhamento.',
        'I created an issue with clear reproduction steps.',
      ],
      [
        'reproduce',
        'reproduzir',
        'Fazer um problema acontecer novamente.',
        'Can you reproduce the error locally?',
      ],
    ]),
    lessonOneExercises('lesson-1'),
  ),
  lesson(
    'module-1',
    'lesson-2',
    2,
    'Clarifying requirements',
    'Esclarecendo requisitos',
    'Practice language for understanding expectations and turning vague ideas into clear requirements.',
    'Pratique linguagem para entender expectativas e transformar ideias vagas em requisitos claros.',
    'During planning, the team discusses a request to make the application “fast”. A developer asks for a measurable response time and an example of the expected behavior.',
    'Durante o planejamento, a equipe discute um pedido para deixar a aplicação “rápida”. Uma pessoa desenvolvedora pede um tempo de resposta mensurável e um exemplo do comportamento esperado.',
    vocabulary('lesson-2', [
      [
        'requirement',
        'requisito',
        'Comportamento ou restrição que o produto deve atender.',
        'This requirement describes the expected user behavior.',
      ],
      [
        'expected behavior',
        'comportamento esperado',
        'O resultado que deve acontecer em uma situação definida.',
        'The ticket explains the expected behavior after submission.',
      ],
      [
        'clarify',
        'esclarecer',
        'Tornar uma ideia mais clara e específica.',
        'Let us clarify the acceptance criteria first.',
      ],
    ]),
    lessonTwoExercises('lesson-2'),
  ),
]

const moduleTwoLessons = [
  lesson(
    'module-2',
    'lesson-3',
    1,
    'Collaborating in code review',
    'Colaborando em revisão de código',
    'Learn respectful phrases for reviewing changes and discussing improvements with other developers.',
    'Aprenda frases respeitosas para revisar alterações e discutir melhorias com outras pessoas desenvolvedoras.',
    'A reviewer sees repeated logic in a pull request. Instead of criticizing the author, the reviewer asks whether the logic could be extracted into a reusable function.',
    'Uma pessoa revisora encontra lógica repetida em um pull request. Em vez de criticar a autoria, pergunta se a lógica poderia ser extraída para uma função reutilizável.',
    vocabulary('lesson-3', [
      [
        'review',
        'revisar',
        'Examinar uma alteração para verificar qualidade e possíveis melhorias.',
        'Please review the changes before the release.',
      ],
      [
        'approve',
        'aprovar',
        'Aceitar uma alteração como pronta para seguir.',
        'I approve this pull request.',
      ],
      [
        'constructive',
        'construtivo',
        'Que ajuda a melhorar algo de forma respeitosa.',
        'The reviewer left constructive feedback.',
      ],
    ]),
    lessonThreeExercises('lesson-3'),
  ),
  lesson(
    'module-2',
    'lesson-4',
    2,
    'Describing deployments',
    'Descrevendo deploys',
    'Practice vocabulary for releasing software, identifying deployment problems, and recovering safely.',
    'Pratique vocabulário para publicar software, identificar problemas de deploy e recuperar-se com segurança.',
    'A release is deployed to staging before production. The build fails because a configuration file is missing, so the team fixes the issue before continuing.',
    'Uma versão é publicada em staging antes da produção. O build falha porque falta um arquivo de configuração, então a equipe corrige o problema antes de continuar.',
    vocabulary('lesson-4', [
      [
        'deploy',
        'fazer deploy / publicar',
        'Disponibilizar uma versão do software em um ambiente.',
        'We deploy the release to staging first.',
      ],
      [
        'rollback',
        'reverter',
        'Retornar uma implantação para uma versão anterior.',
        'The team prepared a rollback after the incident.',
      ],
      [
        'environment',
        'ambiente',
        'Contexto onde o software é executado, como staging ou produção.',
        'The change works in the test environment.',
      ],
    ]),
    lessonFourExercises('lesson-4'),
  ),
]

const moduleThreeLessons = [
  lesson(
    'module-3',
    'lesson-5',
    1,
    'Reading technical documentation',
    'Lendo documentação técnica',
    'Build reading strategies around instructions, examples, prerequisites, and expected output.',
    'Desenvolva estratégias de leitura para instruções, exemplos, pré-requisitos e resultados esperados.',
    'Before using a command, a developer checks the prerequisites and follows the example. After running it, they compare the output with the documented result.',
    'Antes de usar um comando, uma pessoa desenvolvedora verifica os pré-requisitos e segue o exemplo. Depois de executá-lo, compara a saída com o resultado documentado.',
    vocabulary('lesson-5', [
      [
        'prerequisite',
        'pré-requisito',
        'Condição ou recurso necessário antes de começar.',
        'Node.js is a prerequisite for this command.',
      ],
      [
        'output',
        'saída',
        'Resultado produzido por um comando ou processo.',
        'Check the output for the expected message.',
      ],
      [
        'usage',
        'uso',
        'Forma como algo deve ser utilizado.',
        'The example shows the basic usage of the tool.',
      ],
    ]),
    lessonFiveExercises('lesson-5'),
  ),
  lesson(
    'module-3',
    'lesson-6',
    2,
    'Giving clear status updates',
    'Dando atualizações de status claras',
    'Practice concise updates about completed work, current progress, blockers, and requests for help.',
    'Pratique atualizações concisas sobre trabalho concluído, progresso atual, bloqueios e pedidos de ajuda.',
    'In a team update, a developer says what was completed, what is being tested, and which issue is blocking the next step. The team can then offer targeted help.',
    'Em uma atualização para a equipe, uma pessoa desenvolvedora diz o que foi concluído, o que está sendo testado e qual problema bloqueia o próximo passo. Assim, a equipe pode oferecer ajuda específica.',
    vocabulary('lesson-6', [
      [
        'status update',
        'atualização de status',
        'Mensagem curta sobre o estado atual do trabalho.',
        'I will post a status update after the test run.',
      ],
      [
        'blocked',
        'bloqueado',
        'Impedido de continuar por causa de um obstáculo.',
        'I am blocked by a missing test environment.',
      ],
      [
        'next step',
        'próximo passo',
        'A ação que deve acontecer depois.',
        'The next step is to review the logs.',
      ],
    ]),
    lessonSixExercises('lesson-6'),
  ),
]

export const learningPath: LearningPath = {
  modules: [
    module(
      'module-1',
      1,
      'Software problems',
      'Problemas de software',
      moduleOneLessons,
    ),
    module(
      'module-2',
      2,
      'Team collaboration',
      'Colaboração em equipe',
      moduleTwoLessons,
    ),
    module(
      'module-3',
      3,
      'Professional communication',
      'Comunicação profissional',
      moduleThreeLessons,
    ),
  ],
}
