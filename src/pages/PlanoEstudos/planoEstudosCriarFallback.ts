// Dados usados apenas enquanto GET /aluno/plano-estudos/opcoes ainda não respondeu ou falhou.
import type { ProvaOpcao, MateriaOpcao } from '../../types/planoEstudosCriar'

export const PROVAS_FALLBACK: ProvaOpcao[] = [
  { slug: 'enem', nome: 'ENEM', descricao: 'Exame Nacional do Ensino Médio' },
  { slug: 'fuvest', nome: 'Fuvest', descricao: 'Fundação Universitária para o Vestibular' },
  { slug: 'unicamp', nome: 'Unicamp', descricao: 'Universidade Estadual de Campinas' },
  { slug: 'uerj', nome: 'UERJ', descricao: 'Universidade do Estado do Rio de Janeiro' },
  { slug: 'outras', nome: 'Outras provas', descricao: 'Outras provas e concursos' },
]

export const MATERIAS_FALLBACK: MateriaOpcao[] = [
  { slug: 'portugues', nome: 'Português' },
  { slug: 'matematica', nome: 'Matemática' },
  { slug: 'redacao', nome: 'Redação' },
  { slug: 'fisica', nome: 'Física' },
  { slug: 'quimica', nome: 'Química' },
  { slug: 'biologia', nome: 'Biologia' },
  { slug: 'historia', nome: 'História' },
  { slug: 'geografia', nome: 'Geografia' },
]
