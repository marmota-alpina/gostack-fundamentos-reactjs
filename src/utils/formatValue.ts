import moment from 'moment';

const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(
    value,
  );

export const formatData = (value: Date | string): string =>
  moment(value).format('DD/MM/yyyy');

export default formatValue;
