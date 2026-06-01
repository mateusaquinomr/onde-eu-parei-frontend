export interface EnemContent {
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

export interface EnemTopic {
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    contents: EnemContent[];
}

export const enemTopicsData: EnemTopic[] = [

    {
        name: "Linguagens, Códigos e suas Tecnologias",
        notebookColor: "azul",
        difficulty: "medio",
        contents: [

            { title: "Português: Gêneros textuais e tipos de texto", importance: "muita" },
            { title: "Português: Interpretação de texto", importance: "muita" },
            { title: "Português: Texto argumentativo", importance: "muita" },
            { title: "Português: Coesão e coerência", importance: "muita" },
            { title: "Português: Funções da linguagem", importance: "normal" },
            { title: "Português: Variação linguística (norma culta vs informal)", importance: "normal" },
            { title: "Português: Recursos linguísticos (conectivos, tempos verbais)", importance: "normal" },

            { title: "Literatura: Escolas literárias brasileiras", importance: "muita" },
            { title: "Literatura: Relação entre literatura e contexto histórico", importance: "muita" },
            { title: "Literatura: Gêneros literários (narrativo, lírico, dramático)", importance: "normal" },
            { title: "Literatura: Interpretação de textos literários", importance: "muita" },

            { title: "Artes: Artes visuais, teatro, música e dança", importance: "normal" },
            { title: "Artes: Contexto social da arte", importance: "normal" },
            { title: "Artes: Cultura, diversidade e identidade", importance: "normal" },

            { title: "Educação Física: Corpo, cultura e sociedade", importance: "normal" },
            { title: "Educação Física: Saúde e atividade física", importance: "normal" },

            { title: "Tecnologias: Gêneros digitais", importance: "normal" },
            { title: "Tecnologias: Impacto da tecnologia na comunicação", importance: "normal" },
            { title: "Tecnologias: Cultura digital", importance: "normal" }
        ]
    },

    {
        name: "Matemática e suas Tecnologias",
        notebookColor: "verde",
        difficulty: "dificil",
        contents: [

            { title: "Matemática Básica: Conjuntos numéricos", importance: "muita" },
            { title: "Matemática Básica: Razão e proporção", importance: "muita" },
            { title: "Matemática Básica: Porcentagem", importance: "muita" },
            { title: "Matemática Básica: Juros (simples e compostos)", importance: "normal" },
            { title: "Matemática Básica: Sequências e progressões", importance: "normal" },
            { title: "Matemática Básica: Análise combinatória", importance: "muita" },

            { title: "Álgebra: Equações e inequações", importance: "muita" },
            { title: "Álgebra: Funções (1º grau, 2º grau, exponencial, logarítmica)", importance: "muita" },
            { title: "Álgebra: Polinômios", importance: "normal" },

            { title: "Geometria: Geometria plana (área, perímetro)", importance: "muita" },
            { title: "Geometria: Geometria espacial (volume)", importance: "normal" },
            { title: "Geometria: Triângulos (semelhança, Pitágoras)", importance: "muita" },
            { title: "Geometria: Circunferência", importance: "normal" },
            { title: "Geometria: Trigonometria", importance: "normal" },

            { title: "Geometria Analítica: Plano cartesiano", importance: "normal" },
            { title: "Geometria Analítica: Retas", importance: "normal" },
            { title: "Geometria Analítica: Circunferência", importance: "pouco" },

            { title: "Estatística: Média, moda, mediana", importance: "muita" },
            { title: "Estatística: Gráficos e tabelas", importance: "muita" },
            { title: "Estatística: Probabilidade", importance: "muita" }
        ]
    },

    {
        name: "Física",
        notebookColor: "vermelho",
        difficulty: "dificil",
        contents: [

            { title: "Mecânica: Movimento (velocidade, aceleração)", importance: "muita" },
            { title: "Mecânica: Leis de Newton", importance: "muita" },
            { title: "Mecânica: Força e equilíbrio", importance: "normal" },
            { title: "Mecânica: Gravitação", importance: "normal" },

            { title: "Eletricidade: Corrente elétrica", importance: "normal" },
            { title: "Eletricidade: Lei de Ohm", importance: "muita" },
            { title: "Eletricidade: Circuitos", importance: "normal" },
            { title: "Eletricidade: Campo elétrico e magnético", importance: "pouco" },

            { title: "Termologia: Calor e temperatura", importance: "normal" },
            { title: "Termologia: Dilatação", importance: "pouco" },
            { title: "Termologia: Leis da termodinâmica", importance: "normal" },

            { title: "Ondulatória: Ondas", importance: "normal" },
            { title: "Ondulatória: Som", importance: "pouco" },
            { title: "Óptica: Luz", importance: "normal" },
            { title: "Óptica: Espelhos e lentes", importance: "pouco" },

            { title: "Energia: Trabalho e potência", importance: "normal" },
            { title: "Energia: Energia cinética e potencial", importance: "muita" },
            { title: "Energia: Conservação de energia", importance: "muita" }
        ]
    },

    {
        name: "Química",
        notebookColor: "vermelho",
        difficulty: "dificil",
        contents: [

            { title: "Química Geral: Estrutura atômica", importance: "muita" },
            { title: "Química Geral: Tabela periódica", importance: "muita" },
            { title: "Química Geral: Ligações químicas", importance: "muita" },

            { title: "Reações Químicas: Balanceamento", importance: "muita" },
            { title: "Reações Químicas: Estequiometria", importance: "muita" },

            { title: "Soluções: Concentração", importance: "normal" },
            { title: "Soluções: pH", importance: "normal" },
            { title: "Soluções: Ácidos e bases", importance: "normal" },

            { title: "Físico-Química: Termoquímica", importance: "normal" },
            { title: "Físico-Química: Cinética química", importance: "normal" },
            { title: "Físico-Química: Equilíbrio químico", importance: "muita" },

            { title: "Química Orgânica: Hidrocarbonetos", importance: "muita" },
            { title: "Química Orgânica: Funções orgânicas", importance: "muita" },
            { title: "Química Orgânica: Polímeros", importance: "normal" },

            { title: "Química Ambiental: Poluição", importance: "normal" },
            { title: "Química Ambiental: Combustíveis", importance: "normal" },
            { title: "Química Ambiental: Impactos ambientais", importance: "normal" }
        ]
    },

    {
        name: "Biologia",
        notebookColor: "vermelho",
        difficulty: "dificil",
        contents: [

            { title: "Citologia: Célula (estrutura e função)", importance: "muita" },
            { title: "Citologia: Metabolismo (respiração, fotossíntese)", importance: "muita" },

            { title: "Genética: Leis de Mendel", importance: "muita" },
            { title: "Genética: DNA e RNA", importance: "muita" },
            { title: "Genética: Hereditariedade", importance: "muita" },

            { title: "Evolução: Darwinismo", importance: "normal" },
            { title: "Evolução: Seleção natural", importance: "normal" },

            { title: "Ecologia: Ecossistemas", importance: "muita" },
            { title: "Ecologia: Cadeia alimentar", importance: "muita" },
            { title: "Ecologia: Impactos ambientais", importance: "normal" },

            { title: "Corpo Humano: Sistemas do corpo", importance: "muita" },
            { title: "Corpo Humano: Doenças", importance: "normal" },
            { title: "Corpo Humano: Saúde", importance: "normal" },

            { title: "Biotecnologia: Clonagem", importance: "pouco" },
            { title: "Biotecnologia: Engenharia genética", importance: "pouco" }
        ]
    },


    {
        name: "História",
        notebookColor: "amarelo",
        difficulty: "medio",
        contents: [
            { title: "História do Brasil: Colônia", importance: "muita" },
            { title: "História do Brasil: Império", importance: "muita" },
            { title: "História do Brasil: República", importance: "muita" },
            { title: "História: Escravidão", importance: "muita" },
            { title: "História: Movimentos sociais", importance: "normal" },
            { title: "História: Guerras mundiais", importance: "muita" },
            { title: "História: Guerra Fria", importance: "normal" }
        ]
    },
    {
        name: "Geografia",
        notebookColor: "amarelo",
        difficulty: "medio",
        contents: [
            { title: "Geografia: Globalização", importance: "muita" },
            { title: "Geografia: Urbanização", importance: "normal" },
            { title: "Geografia: Agricultura", importance: "normal" },
            { title: "Geografia: Clima", importance: "muita" },
            { title: "Geografia: Biomas", importance: "muita" },
            { title: "Geografia: Meio ambiente", importance: "muita" }
        ]
    },
    {
        name: "Filosofia",
        notebookColor: "amarelo",
        difficulty: "facil",
        contents: [
            { title: "Filosofia: Ética", importance: "normal" },
            { title: "Filosofia: Política", importance: "normal" },
            { title: "Filosofia: Conhecimento", importance: "pouco" },
            { title: "Filosofia: Filósofos clássicos", importance: "normal" }
        ]
    },
    {
        name: "Sociologia",
        notebookColor: "amarelo",
        difficulty: "facil",
        contents: [
            { title: "Sociologia: Cultura", importance: "normal" },
            { title: "Sociologia: Sociedade", importance: "normal" },
            { title: "Sociologia: Cidadania", importance: "normal" },
            { title: "Sociologia: Movimentos sociais", importance: "normal" },
            { title: "Sociologia: Desigualdade", importance: "muita" }
        ]
    }
];