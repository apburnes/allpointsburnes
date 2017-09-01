import format from 'date-fns/format';

export default function formatDate(d) {
  return format(d, 'MMMM  Do, YYYY');
}
