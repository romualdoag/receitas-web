import type { Address } from '../types';

/** Remove tudo que não for dígito. */
export const onlyDigits = (v: string): string => v.replace(/\D/g, '');

/** Mascara CEP no formato 00000-000 (aceita entrada parcial). */
export const maskCep = (v: string): string => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

/** Monta o endereço em linha única para o documento impresso. */
export const formatEndereco = (addr: Address): string => {
  const linha1 = [addr.logradouro, addr.numero].filter(Boolean).join(', ');
  const complemento = addr.complemento ? ` (${addr.complemento})` : '';
  const cidadeUf = [addr.cidade, addr.uf].filter(Boolean).join('/');
  const cepFmt = addr.cep ? `CEP ${maskCep(addr.cep)}` : '';

  return [
    linha1 + complemento,
    addr.bairro,
    cidadeUf,
    cepFmt,
  ]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' - ');
};
