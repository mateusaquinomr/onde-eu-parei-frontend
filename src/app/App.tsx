import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { Text } from "@/shared/components/ui/Text/Text";
import { StudyTimer } from '@/features/topics/components/StudyTimer';
import { TopicsPage } from '@/features/topics/pages/TopicsPage';
import { TopicDetailPage } from '@/features/topics/pages/TopicDetailPage';
import { CyclePage } from '@/features/cycle/pages/CyclePage/CyclePage';
import { PerformancePage } from '@/features/performance/pages/PerformancePage/PerformancePage';

import { FormField } from "../shared/components/ui/Form/FormField";
import { Input } from "../shared/components/ui/Form/Input";
import { Textarea } from "../shared/components/ui/Form/Textarea";
import { Select } from "../shared/components/ui/Form/Select";
import { MultiSelect } from "../shared/components/ui/Form/MultiSelect";
import { DatePicker } from "../shared/components/ui/Form/DatePicker";
import { Checkbox } from "../shared/components/ui/Form/Checkbox";
import { RadioGroup } from "../shared/components/ui/Form/RadioGroup";
import { TagInput } from "../shared/components/ui/Form/TagInput/TagInput";
import { NotesWidget } from '../features/notes/components/NotesWidget/NotesWidget';

import type { TagItem as TagType } from "../shared/components/ui/Form/TagInput/types"
import { Button } from "../shared/components/ui/Button/Button";

function App() {

  const mockStudyData = {
    topicId: 'topic-1',
    contentId: 'content-1',
    topicName: 'Direito Constitucional',
    contentTitle: 'Art. 1º ao 4º - Princípios Fundamentais',
    estimatedTime: 25,
  };

  const handleTimeUpdate = (contentId: string, elapsedSeconds: number) => {
    console.log(`Tempo atualizado - Conteúdo: ${contentId}, Segundos: ${elapsedSeconds}`);
  };

  const handleComplete = (contentId: string, totalSeconds: number) => {
    console.log(`Estudo concluído! - Conteúdo: ${contentId}, Tempo total: ${totalSeconds}s`);
    alert(`Parabéns! Você completou o estudo de ${mockStudyData.contentTitle}`);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [endDate, setEndDate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [progressType, setProgressType] = useState("subgoals");
  const [tags, setTags] = useState<TagType[]>([]);

  return (

    // Testando componentes criados

    <Routes>
      <Route path="/topics" element={<TopicsPage />} />
      <Route path="/topics/:id" element={<TopicDetailPage />} />
      <Route path="/cycle" element={<CyclePage />} />
      <Route path="/performance" element={<PerformancePage />} />

      <Route path="/" element={
        <div style={{ padding: "24px", display: "grid", gap: "16px" }}>

          <nav style={{ marginBottom: '20px', padding: '10px' }}>
            <Link to="/" style={{ marginRight: '20px' }}>Home </Link>
            <Link to="/topics" style={{ marginRight: '20px' }}>Ver todos os tópicos</Link>
            <Link to="/cycle" style={{ marginRight: '20px' }}>Ciclo de Estudo</Link>
            <Link to="/performance" style={{ marginRight: '20px' }}>Performance </Link>
          </nav>

          <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
          }}>

            <div style={{
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              maxWidth: 450,
              width: '100%',
              overflow: 'hidden'
            }}>

              <div style={{ padding: '24px 24px 16px 24px' }}>
                <StudyTimer
                  topicId={mockStudyData.topicId}
                  contentId={mockStudyData.contentId}
                  topicName={mockStudyData.topicName}
                  contentTitle={mockStudyData.contentTitle}
                  estimatedTime={mockStudyData.estimatedTime}
                  onTimeUpdate={handleTimeUpdate}
                  onComplete={handleComplete}
                />
              </div>

              <div style={{ padding: '0 24px 24px 24px' }}>
                <NotesWidget
                  topicId={mockStudyData.topicId}
                  contentId={mockStudyData.contentId}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              maxWidth: 400,
            }}
          >
            <Button>Salvar</Button>
            <Button icon={<span>+</span>}>Criar objetivo</Button>
            <Button variant="secondary" icon={<span>Editar</span>}>Editar</Button>
            <Button variant="ghost" icon={<span>v</span>}>Voltar</Button>
            <Button icon={<span>⋯</span>} aria-label="Mais opções" />
            <Button variant="secondary" icon={<span>x</span>} aria-label="Fechar" />
          </div>

          <Text as="h1" variant="pageTitle">
            Teste de componentes UI
          </Text>

          <FormField label="Disciplina" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o nome da disciplina..."
            />
          </FormField>

          <FormField label="Descrição">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione comentários..."
            />
          </FormField>

          <FormField label="Categoria">
            <Select
              value={assignedTo}
              onChange={setAssignedTo}
              options={[
                { label: "Exatas", value: "Exatas" },
                { label: "Teórica", value: "Teórica" },
                { label: "Redação", value: "redação" },
              ]}
            />
          </FormField>

          <FormField label="Outras categorias">
            <MultiSelect
              value={categories}
              onChange={setCategories}
              options={[
                { label: "Arte", value: "arte" },
                { label: "Games", value: "games" },
                { label: "Metaverso", value: "metaverso" },
                { label: "Design", value: "design" },
              ]}
            />
          </FormField>

          <FormField label="Data de inicio">
            <DatePicker value={endDate} onChange={setEndDate} />
          </FormField>

          <FormField>
            <Checkbox
              checked={isPublic}
              onChange={setIsPublic}
              label="Tem prazo?"
            />
          </FormField>

          <FormField label="Caderno">
            <RadioGroup
              value={progressType}
              onChange={setProgressType}
              options={[
                { label: "Azul", value: "blue" },
                { label: "Amarelo", value: "yellow" },
                { label: "Verde", value: "green" },
                { label: "Vermelho", value: "red" },
              ]}
            />
          </FormField>

          <FormField label="Tags" helperText="Clique enter depois de cada tag">
            <TagInput value={tags} onChange={setTags} maxTags={10} />
          </FormField>

          <Text as="h1" variant="pageTitle">Título Página – H1</Text>
          <Text as="h2" variant="cardTitle">Título Card – H2</Text>
          <Text as="h3" variant="cardSectionTitle">Título Seção do Card – H3</Text>
          <Text as="label" variant="label">Label</Text>
          <Text as="p" variant="body">Texto Body</Text>
          <Text as="span" variant="caption">Informação pequena</Text>
          <Text as="span" variant="helper">Dicas</Text>
          <Text as="p" variant="note">Observações/avisos</Text>

        </div>
      } />
    </Routes>
  );
}

export default App;