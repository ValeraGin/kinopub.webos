import millify from 'millify';

export function numberToHuman(number: number) {
  return millify(number);
}
