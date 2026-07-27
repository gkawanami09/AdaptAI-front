export const MATERIA_AREAS = [
  { value: 'matematica', label: 'Matemática' },
  { value: 'natureza', label: 'Ciências da Natureza' },
  { value: 'humanas', label: 'Ciências Humanas' },
  { value: 'linguagens', label: 'Linguagens' },
  { value: 'redacao', label: 'Redação' },
] as const

export type MateriaArea = (typeof MATERIA_AREAS)[number]['value']

export function getMateriaAreaLabel(area: MateriaArea): string {
  return MATERIA_AREAS.find((item) => item.value === area)?.label ?? area
}
