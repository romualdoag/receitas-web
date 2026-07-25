import React, { useState } from 'react';
import { Loader2, MapPin, Search, AlertCircle } from 'lucide-react';
import type { Address } from '../types';
import { useCep } from '../hooks/useCep';
import { maskCep, onlyDigits } from '../utils/format';

interface AddressFieldsProps {
  value: Address;
  onChange: (address: Address) => void;
}

const inputBase =
  'w-full px-3 py-2 rounded-lg border border-line bg-white text-ink placeholder:text-ink-soft/50 ' +
  'focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors';

const AddressFields: React.FC<AddressFieldsProps> = ({ value, onChange }) => {
  const { loading, error, lookup, reset } = useCep();
  const [autofilled, setAutofilled] = useState(false);

  const set = (patch: Partial<Address>) => onChange({ ...value, ...patch });

  const runLookup = async (rawCep: string) => {
    const filled = await lookup(rawCep);
    if (filled) {
      onChange({ ...value, cep: maskCep(rawCep), ...filled });
      setAutofilled(true);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCep(e.target.value);
    set({ cep: masked });
    setAutofilled(false);
    if (error) reset();
    // Consulta automática assim que os 8 dígitos são digitados.
    if (onlyDigits(masked).length === 8) void runLookup(masked);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
          CEP
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            className={`${inputBase} font-mono pr-10`}
            value={value.cep}
            maxLength={9}
            onChange={handleCepChange}
            onBlur={() => {
              // Evita chamada dupla: onChange já consulta ao completar 8 dígitos.
              if (!autofilled && !error && onlyDigits(value.cep).length === 8) runLookup(value.cep);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'cep-error' : undefined}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-teal" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </span>
        </div>
        {error ? (
          <p id="cep-error" className="mt-1 flex items-center gap-1 text-xs text-rx-red">
            <AlertCircle className="h-3.5 w-3.5" />
            {error} Preencha o endereço manualmente.
          </p>
        ) : autofilled ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-teal">
            <MapPin className="h-3.5 w-3.5" />
            Endereço preenchido pelo CEP.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Logradouro"
          className={`${inputBase} col-span-2`}
          value={value.logradouro}
          onChange={(e) => set({ logradouro: e.target.value })}
        />
        <input
          type="text"
          placeholder="Número"
          className={`${inputBase} font-mono`}
          value={value.numero}
          onChange={(e) => set({ numero: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Complemento"
          className={inputBase}
          value={value.complemento}
          onChange={(e) => set({ complemento: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bairro"
          className={inputBase}
          value={value.bairro}
          onChange={(e) => set({ bairro: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Cidade"
          className={`${inputBase} col-span-2`}
          value={value.cidade}
          onChange={(e) => set({ cidade: e.target.value })}
        />
        <input
          type="text"
          placeholder="UF"
          maxLength={2}
          className={`${inputBase} uppercase`}
          value={value.uf}
          onChange={(e) => set({ uf: e.target.value.toUpperCase() })}
        />
      </div>
    </div>
  );
};

export default AddressFields;
