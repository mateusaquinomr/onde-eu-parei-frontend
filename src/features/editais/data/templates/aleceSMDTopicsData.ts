export interface AleceContent {
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

export interface AleceTopic {
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    editalId: string;
    contents: AleceContent[];
}

export const aleceSMDTopicsData: AleceTopic[] = [

    {
        name: "Língua Portuguesa",
        notebookColor: "azul",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [

            { title: "Leitura, compreensão e interpretação de textos", importance: "muita" },
            { title: "Estruturação do texto e dos parágrafos", importance: "muita" },
            { title: "Coesão e coerência textuais", importance: "muita" },
            { title: "Referenciação textual (pronomes e expressões referenciais)", importance: "normal" },
            { title: "Articulação do texto: nexos e operadores sequenciais", importance: "normal" },
            { title: "Significação contextual de palavras e expressões", importance: "normal" },
            { title: "Equivalência e transformação de estruturas", importance: "normal" },
            { title: "Linguagem verbal e não verbal: ícone, índice e símbolo", importance: "pouco" },
            { title: "Modalizadores discursivos", importance: "pouco" },

            { title: "Sintaxe: processos de coordenação e subordinação", importance: "muita" },
            { title: "Sintaxe do período simples", importance: "muita" },
            { title: "Sintaxe do período composto", importance: "muita" },
            { title: "Emprego de tempos e modos verbais", importance: "muita" },
            { title: "Concordância verbal", importance: "muita" },
            { title: "Concordância nominal", importance: "muita" },
            { title: "Regência verbal", importance: "normal" },
            { title: "Regência nominal", importance: "normal" },
            { title: "Crase", importance: "muita" },
            { title: "Pontuação", importance: "muita" },
            { title: "Pronomes: emprego, formas de tratamento e colocação", importance: "normal" },

            { title: "Estrutura e formação de palavras", importance: "normal" },
            { title: "Funções das classes de palavras", importance: "normal" },
            { title: "Flexão nominal", importance: "normal" },
            { title: "Flexão verbal", importance: "normal" },

            { title: "Ortografia oficial", importance: "muita" },
            { title: "Acentuação gráfica", importance: "muita" }
        ]
    },

    {
        name: "Noções de Informática",
        notebookColor: "preto",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [

            { title: "Hardware: dispositivos de armazenamento, memórias e periféricos", importance: "normal" },
            { title: "Extensões de arquivos", importance: "normal" },

            { title: "Sistemas Operacionais Windows: conceitos e manipulação", importance: "muita" },
            { title: "Sistemas Operacionais Linux: conceitos e manipulação", importance: "normal" },
            { title: "Arquivos, pastas, diretórios e atalhos", importance: "muita" },
            { title: "Área de trabalho e área de transferência", importance: "normal" },
            { title: "Manipulação de arquivos e pastas", importance: "muita" },
            { title: "Uso de menus, programas e aplicativos", importance: "normal" },

            { title: "Word: edição e formatação de textos", importance: "muita" },
            { title: "Word: cabeçalhos, parágrafos, fontes, colunas e marcadores", importance: "normal" },
            { title: "Word: tabelas, impressão, quebras e numeração de páginas", importance: "normal" },
            { title: "Word: legendas, índices, inserção de objetos e caixas de texto", importance: "pouco" },
            { title: "Excel: estrutura básica de planilhas", importance: "muita" },
            { title: "Excel: fórmulas e funções", importance: "muita" },
            { title: "Excel: tabelas e gráficos", importance: "normal" },
            { title: "Excel: macros e classificação de dados", importance: "pouco" },
            { title: "PowerPoint: criação e formatação de apresentações", importance: "normal" },
            { title: "OneDrive e SharePoint: armazenamento e colaboração", importance: "pouco" },

            { title: "Correio eletrônico: preparo, envio e anexação de arquivos", importance: "normal" },
            { title: "Microsoft Teams", importance: "pouco" },
            { title: "Google Meet", importance: "pouco" },
            { title: "Zoom", importance: "pouco" },
            { title: "Internet, intranet e extranet", importance: "normal" },
            { title: "Protocolos e serviços da internet (HTTP/HTTPS, etc.)", importance: "normal" },
            { title: "Sítios de busca e pesquisa na internet", importance: "normal" },
            { title: "Conceitos de URL, links e sites", importance: "normal" },
            { title: "Navegadores: Mozilla Firefox e Google Chrome", importance: "normal" },
            { title: "Computação em nuvem: conceitos e serviços", importance: "normal" },
            { title: "Redes sociais", importance: "normal" },

            { title: "Princípios de segurança e confidencialidade", importance: "muita" },
            { title: "Assinatura digital", importance: "normal" },
            { title: "Procedimentos de segurança e backup", importance: "normal" },
            { title: "Ferramentas de segurança (antivírus e firewalls)", importance: "normal" },
            { title: "Malwares e ataques", importance: "muita" },

            { title: "Conceitos básicos de inteligência artificial", importance: "normal" },
            { title: "Técnicas de prompts (engenharia de prompt)", importance: "pouco" }
        ]
    },

    {
        name: "Legislação e Ética no Serviço Público",
        notebookColor: "amarelo",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [

            { title: "Lei Geral de Proteção de Dados Pessoais (LGPD) - Lei 13.709/2018", importance: "muita" },
            { title: "LGPD: conceitos de dados pessoais e tratamento", importance: "muita" },
            { title: "LGPD: direitos do titular", importance: "normal" },

            { title: "Lei de Acesso à Informação (LAI) - Lei 12.527/2011", importance: "muita" },
            { title: "LAI: transparência e acesso à informação", importance: "normal" },

            { title: "Ética e moral: definição e distinção", importance: "normal" },
            { title: "Ética no serviço público e função pública", importance: "muita" },
            { title: "Valores, virtude, honestidade, integridade, decoro e zelo", importance: "muita" },
            { title: "Ética, democracia, cidadania e o papel do servidor público", importance: "normal" },

            { title: "Princípios da Administração Pública: legalidade, impessoalidade, moralidade", importance: "muita" },
            { title: "Princípios da Administração Pública: publicidade e eficiência", importance: "muita" },
            { title: "Aplicação dos princípios éticos na Administração Pública", importance: "normal" },

            { title: "Estatuto dos Funcionários Públicos do Ceará - Lei 9.826/1974", importance: "muita" },
            { title: "Plano de Cargos, Carreira e Remuneração da ALECE - Lei 17.091/2019", importance: "normal" },
            { title: "Código de Ética e Decoro Parlamentar - Resolução 546/2006", importance: "normal" },
            { title: "Regimento Interno da ALECE - Resolução 751/2022", importance: "muita" },
            { title: "Estrutura Organizacional da ALECE - Resolução 780/2025", importance: "normal" },
            { title: "Código de Ética e Conduta dos Servidores da ALECE - Resolução 783/2026", importance: "muita" }
        ]
    },


    {
        name: "Desenvolvimento Web",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "alece-smd",
        contents: [
            { title: "HTML: estruturação de páginas web", importance: "muita" },
            { title: "CSS: estilização e layout", importance: "muita" },
            { title: "JavaScript: programação front-end", importance: "muita" },
            { title: "Desenvolvimento Front-end", importance: "muita" },
            { title: "Desenvolvimento Back-end", importance: "muita" },
            { title: "APIs e integração com serviços", importance: "normal" },
            { title: "Desenvolvimento para dispositivos móveis", importance: "normal" },
            { title: "Desenvolvimento multiplataforma", importance: "normal" }
        ]
    },

    {
        name: "Engenharia de Software",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "alece-smd",
        contents: [
            { title: "Ciclo de vida do software", importance: "normal" },
            { title: "Arquitetura de software", importance: "normal" },
            { title: "Padrões de projeto (Design Patterns)", importance: "normal" },
            { title: "Versionamento de código (Git, etc.)", importance: "normal" },
            { title: "Testes de software", importance: "normal" },
            { title: "Manutenção de software", importance: "normal" },
            { title: "Boas práticas de engenharia de software", importance: "muita" },
            { title: "Segurança em desenvolvimento de software", importance: "muita" }
        ]
    },

    {
        name: "UX/UI Design",
        notebookColor: "rosa",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "UX (User Experience): conceitos e fundamentos", importance: "muita" },
            { title: "UI (User Interface): conceitos e fundamentos", importance: "muita" },
            { title: "Design centrado no usuário", importance: "muita" },
            { title: "Wireframes e prototipação", importance: "normal" },
            { title: "Design System", importance: "normal" },
            { title: "Usabilidade em interfaces digitais", importance: "muita" },
            { title: "Acessibilidade em interfaces digitais", importance: "normal" },
            { title: "Pesquisa com usuários", importance: "normal" }
        ]
    },

    {
        name: "Banco de Dados",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "alece-smd",
        contents: [
            { title: "Modelagem de dados", importance: "muita" },
            { title: "Bancos de dados relacionais", importance: "muita" },
            { title: "Bancos de dados não relacionais (NoSQL)", importance: "normal" },
            { title: "Integração com sistemas e aplicações", importance: "muita" },
            { title: "Persistência de dados", importance: "normal" }
        ]
    },

    {
        name: "Mídias Digitais",
        notebookColor: "verde",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "Bases conceituais de mídia", importance: "muita" },
            { title: "Público-alvo e segmentação", importance: "muita" },
            { title: "Planejamento de mídias digitais", importance: "muita" },
            { title: "Estratégias de mídia digital", importance: "muita" },
            { title: "Produtos e formatos para mídias digitais", importance: "normal" },
            { title: "Plataformas digitais", importance: "normal" }
        ]
    },

    {
        name: "Planejamento de Mídia",
        notebookColor: "verde",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "Planejamento e pesquisa de mídia", importance: "muita" },
            { title: "Classificação de mídias", importance: "normal" },
            { title: "Estratégias e execução de campanhas", importance: "muita" },
            { title: "Avaliação de campanhas de mídia", importance: "normal" }
        ]
    },

    {
        name: "Produção Multimídia",
        notebookColor: "rosa",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "Produção multimídia: áudio e vídeo", importance: "muita" },
            { title: "Animação e motion design", importance: "normal" },
            { title: "Modelagem 3D", importance: "pouco" },
            { title: "Jogos digitais", importance: "pouco" },
            { title: "Interfaces interativas e dispositivos", importance: "normal" }
        ]
    },

    {
        name: "Produção Audiovisual",
        notebookColor: "rosa",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "Captação de som e imagem", importance: "muita" },
            { title: "Iluminação e enquadramento", importance: "normal" },
            { title: "Edição e pós-produção de vídeo", importance: "muita" },
            { title: "Roteirização, locução e dublagem", importance: "normal" },
            { title: "Legendas e audiodescrição", importance: "normal" },
            { title: "Formatos de arquivos audiovisuais", importance: "normal" }
        ]
    },

    {
        name: "Design Gráfico",
        notebookColor: "preto",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "Composição e enquadramento", importance: "normal" },
            { title: "Tipografia e hierarquia visual", importance: "normal" },
            { title: "Identidade visual", importance: "normal" },
            { title: "Tratamento e edição de imagens", importance: "muita" },
            { title: "Elaboração de materiais institucionais", importance: "muita" }
        ]
    },

    {
        name: "Marketing Digital",
        notebookColor: "azul",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "SEO (Otimização para mecanismos de busca)", importance: "muita" },
            { title: "Storytelling e produção de conteúdo", importance: "normal" },
            { title: "Marketing de conteúdo", importance: "normal" },
            { title: "Gestão de redes sociais", importance: "muita" },
            { title: "Engajamento e comportamento do público digital", importance: "normal" },
            { title: "Métricas de alcance, tráfego e conversões", importance: "muita" },
            { title: "Ferramentas de gerenciamento de redes sociais", importance: "normal" }
        ]
    },

    {
        name: "Comunicação Pública e Jornalismo Digital",
        notebookColor: "amarelo",
        difficulty: "medio",
        editalId: "alece-smd",
        contents: [
            { title: "Comunicação institucional e pública online", importance: "muita" },
            { title: "Organização e planejamento de coberturas jornalísticas", importance: "normal" },
            { title: "Cobertura de eventos institucionais", importance: "normal" },
            { title: "Jornalismo digital", importance: "normal" },
            { title: "Inclusão digital e acessibilidade comunicacional", importance: "normal" },
            { title: "Combate à desinformação", importance: "muita" }
        ]
    }
];