export interface IbgeContent {
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

export interface IbgeTopic {
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    editalId: string;
    contents: IbgeContent[];
}

export const ibgeTopicsData: IbgeTopic[] = [
    {
        name: "Língua Portuguesa",
        notebookColor: "azul",
        difficulty: "medio",
        editalId: "ibge",
        contents: [
            { title: "Compreensão e interpretação de texto", importance: "muita" },
            { title: "Significação das palavras: sinônimos, antônimos, homônimos e parônimos", importance: "normal" },
            { title: "Pontuação", importance: "muita" },
            { title: "Estrutura e sequência lógica de frases e parágrafos", importance: "muita" },
            { title: "Ortografia oficial e acentuação gráfica", importance: "muita" },
            { title: "Classes das palavras", importance: "normal" },
            { title: "Concordância nominal e verbal", importance: "muita" },
            { title: "Regência nominal e verbal", importance: "muita" },
            { title: "Emprego dos verbos regulares, irregulares e anômalos", importance: "normal" },
            { title: "Vozes dos verbos", importance: "normal" },
            { title: "Emprego dos pronomes", importance: "normal" },
            { title: "Sintaxe: termos essenciais, integrantes e acessórios da oração", importance: "muita" },
            { title: "Coesão e coerência: referenciação, substituição, repetição, conectores", importance: "muita" },
            { title: "Coesão e coerência: tempos e modos verbais", importance: "normal" },
            { title: "Redação e reescrita de comunicados, ofícios e registros operacionais", importance: "normal" }
        ]
    },
    {
        name: "Raciocínio Lógico Quantitativo",
        notebookColor: "verde",
        difficulty: "dificil",
        editalId: "ibge",
        contents: [
            { title: "Estruturas lógicas: proposições, conectivos e tabelas verdade", importance: "muita" },
            { title: "Lógica de argumentação: dedução e inferência", importance: "muita" },
            { title: "Diagramas lógicos: conjuntos e relações", importance: "muita" },
            { title: "Aritmética: operações básicas, proporções e porcentagem", importance: "muita" },
            { title: "Álgebra básica: equações e inequações", importance: "normal" },
            { title: "Geometria básica: áreas, perímetros e volumes", importance: "normal" }
        ]
    },
    {
        name: "Gestão de Projetos",
        notebookColor: "amarelo",
        difficulty: "medio",
        editalId: "ibge",
        contents: [
            { title: "PMBOK: conceitos de projetos, programas e portfólios", importance: "muita" },
            { title: "Ciclo de vida dos projetos", importance: "muita" },
            { title: "Áreas de conhecimento: escopo", importance: "muita" },
            { title: "Áreas de conhecimento: prazo", importance: "muita" },
            { title: "Áreas de conhecimento: custo", importance: "normal" },
            { title: "Áreas de conhecimento: qualidade", importance: "muita" },
            { title: "Áreas de conhecimento: riscos", importance: "muita" },
            { title: "Áreas de conhecimento: comunicação", importance: "normal" },
            { title: "Áreas de conhecimento: aquisições", importance: "normal" },
            { title: "Técnicas de gestão de riscos em projetos", importance: "muita" },
            { title: "Monitoramento e controle de projetos", importance: "muita" }
        ]
    },
    {
        name: "Segurança da Informação",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "ibge",
        contents: [
            { title: "Princípios ACID: autenticidade, confidencialidade, integridade e disponibilidade", importance: "muita" },
            { title: "Políticas de segurança da informação", importance: "muita" },
            { title: "Gestão de riscos em segurança", importance: "muita" },
            { title: "Controles de acesso", importance: "muita" },
            { title: "Criptografia básica", importance: "normal" },
            { title: "Segurança em redes e aplicações", importance: "muita" },
            { title: "Gestão de incidentes de segurança", importance: "normal" },
            { title: "Continuidade de negócios", importance: "normal" },
            { title: "Recuperação de desastres", importance: "normal" },
            { title: "ISO/IEC 27001: estrutura e requisitos", importance: "muita" },
            { title: "NIST: diretrizes e boas práticas", importance: "normal" },
            { title: "Lei Geral de Proteção de Dados (LGPD)", importance: "muita" }
        ]
    },
    {
        name: "Governança e Gestão de TI",
        notebookColor: "preto",
        difficulty: "dificil",
        editalId: "ibge",
        contents: [
            { title: "Alinhamento estratégico de TI", importance: "muita" },
            { title: "Gestão de serviços de TI", importance: "muita" },
            { title: "Acordos de nível de serviço (SLA)", importance: "muita" },
            { title: "Catálogo de serviços", importance: "normal" },
            { title: "Gestão de incidentes", importance: "muita" },
            { title: "Gestão de problemas", importance: "normal" },
            { title: "Gestão de mudanças", importance: "muita" },
            { title: "Melhoria contínua de processos", importance: "normal" },
            { title: "COBIT: framework de governança", importance: "muita" },
            { title: "ITIL: framework de gestão de serviços", importance: "muita" },
            { title: "Planejamento estratégico de TI", importance: "muita" },
            { title: "Gestão de portfólio de sistemas", importance: "normal" },
            { title: "Transformação digital", importance: "normal" },
            { title: "Avaliação e adoção de novas tecnologias", importance: "normal" },
            { title: "Indicadores de maturidade tecnológica", importance: "normal" }
        ]
    }
];