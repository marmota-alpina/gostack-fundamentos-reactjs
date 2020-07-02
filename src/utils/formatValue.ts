const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
export const formatDate = (value: Date | string): string =>
  new Date(value).toLocaleDateString('pt-br');
export default formatValue;
