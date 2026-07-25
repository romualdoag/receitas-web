import { useCallback, useState } from 'react';
import type { Address } from '../types';
import { onlyDigits } from '../utils/format';

interface CepV2Response {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

/** Campos do endereço que a BrasilAPI consegue preencher automaticamente. */
export type CepAutofill = Pick<Address, 'logradouro' | 'bairro' | 'cidade' | 'uf'>;

interface UseCepResult {
  loading: boolean;
  error: string | null;
  /** Busca o CEP. Retorna os campos preenchidos ou null em caso de erro. */
  lookup: (cep: string) => Promise<CepAutofill | null>;
  reset: () => void;
}

export function useCep(): UseCepResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => setError(null), []);

  const lookup = useCallback(async (cep: string): Promise<CepAutofill | null> => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) {
      setError('CEP deve ter 8 dígitos.');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`);
      if (!res.ok) {
        setError(res.status === 404 ? 'CEP não encontrado.' : 'Falha ao consultar o CEP.');
        return null;
      }
      const data: CepV2Response = await res.json();
      return {
        logradouro: data.street ?? '',
        bairro: data.neighborhood ?? '',
        cidade: data.city ?? '',
        uf: data.state ?? '',
      };
    } catch {
      setError('Sem conexão para consultar o CEP.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, lookup, reset };
}
