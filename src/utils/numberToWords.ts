export function numberToWords(n: number): string {
  if (n === 0) return 'zero';

  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (n === 100) return 'cem';

  const getWords = (num: number): string => {
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const unit = num % 10;
      const ten = Math.floor(num / 10);
      return tens[ten] + (unit > 0 ? ' e ' + units[unit] : '');
    }
    if (num < 1000) {
      const remainder = num % 100;
      const hundred = Math.floor(num / 100);
      return hundreds[hundred] + (remainder > 0 ? ' e ' + getWords(remainder) : '');
    }
    return num.toString(); // Simple fallback for very large numbers if needed
  };

  return getWords(n);
}
