import React, { useEffect, useState } from 'react';
import { UserCog, Stethoscope, Pill, Printer, Calendar, Plus, Trash2, ListFilter } from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';
import { MEDICATION_PRESETS } from '../data/medicationPresets';
import { emptyAddress } from '../types';
import type { Medication, PrescriptionData, Prescritor, Paciente, Address } from '../types';
import AddressFields from './AddressFields';

interface PrescriptionFormProps {
  onDataChange: (data: PrescriptionData) => void;
  onPrint: () => void;
}

const MAX_MEDS = 2;

const field =
  'w-full px-3 py-2 rounded-lg border border-line bg-white text-ink placeholder:text-ink-soft/50 ' +
  'focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors';

const initialData: PrescriptionData = {
  prescritor: {
    nome: '',
    registro: '',
    uf: '',
    endereco: emptyAddress(),
    telefone: '',
  },
  paciente: {
    nome: '',
    cpf: '',
    idade: '',
    sexo: 'M',
    endereco: emptyAddress(),
  },
  medicamentos: [
    {
      nome: 'Mounjaro (Tirzepatida)',
      dosagem: '5mg/0,5mL - Solução Injetável (4un de 0,5mL)',
      quantidade: 1,
      quantidadeExtenso: 'um',
      posologia:
        'Administrar 1 caneta de 5mg, via subcutânea (no abdome, coxa ou braço), 1 vez por semana. Alternar o local de aplicação a cada dose.',
    },
  ],
  data: new Date().toISOString().split('T')[0],
};

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onDataChange, onPrint }) => {
  const [formData, setFormData] = useState<PrescriptionData>(initialData);

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const setPrescritor = <K extends keyof Prescritor>(field: K, value: Prescritor[K]) =>
    setFormData((prev) => ({ ...prev, prescritor: { ...prev.prescritor, [field]: value } }));

  const setPaciente = <K extends keyof Paciente>(field: K, value: Paciente[K]) =>
    setFormData((prev) => ({ ...prev, paciente: { ...prev.paciente, [field]: value } }));

  const setPrescritorEndereco = (endereco: Address) =>
    setFormData((prev) => ({ ...prev, prescritor: { ...prev.prescritor, endereco } }));

  const setPacienteEndereco = (endereco: Address) =>
    setFormData((prev) => ({ ...prev, paciente: { ...prev.paciente, endereco } }));

  const handleMedicationChange = <K extends keyof Medication>(
    index: number,
    field: K,
    value: Medication[K],
  ) => {
    setFormData((prev) => {
      const medicamentos = prev.medicamentos.map((med, i) => {
        if (i !== index) return med;
        const next = { ...med, [field]: value };
        if (field === 'quantidade') next.quantidadeExtenso = numberToWords(Number(value));
        return next;
      });
      return { ...prev, medicamentos };
    });
  };

  const applyPreset = (index: number, presetLabel: string) => {
    const preset = MEDICATION_PRESETS.find((p) => p.label === presetLabel);
    if (!preset) return;
    setFormData((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med, i) =>
        i === index
          ? { ...med, nome: preset.nome, dosagem: preset.dosagem, posologia: preset.posologia }
          : med,
      ),
    }));
  };

  const addMedication = () =>
    setFormData((prev) =>
      prev.medicamentos.length >= MAX_MEDS
        ? prev
        : {
            ...prev,
            medicamentos: [
              ...prev.medicamentos,
              { nome: '', dosagem: '', quantidade: 1, quantidadeExtenso: 'um', posologia: '' },
            ],
          },
    );

  const removeMedication = (index: number) =>
    setFormData((prev) =>
      prev.medicamentos.length <= 1
        ? prev
        : { ...prev, medicamentos: prev.medicamentos.filter((_, i) => i !== index) },
    );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 print:hidden">
      {/* Cabeçalho — assinatura ℞ */}
      <header className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-line bg-ink px-6 py-5 sm:px-8">
          <span className="font-display text-4xl font-bold leading-none text-teal-tint" aria-hidden>
            ℞
          </span>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Receita de Controle Especial
            </h1>
            <p className="text-sm text-teal-tint/70">Emissor de receita branca · Portaria 344/98</p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-rx-red/40 bg-rx-red/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-rx-red sm:inline-block">
            Controle Especial
          </span>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Prescritor */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 border-b border-line pb-3 font-display text-lg font-semibold text-ink">
            <Stethoscope className="h-5 w-5 text-teal" />
            Profissional
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome completo"
              className={field}
              value={formData.prescritor.nome}
              onChange={(e) => setPrescritor('nome', e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Registro (ex.: CRM 12345)"
                className={`${field} font-mono`}
                value={formData.prescritor.registro}
                onChange={(e) => setPrescritor('registro', e.target.value)}
              />
              <input
                type="text"
                placeholder="UF"
                maxLength={2}
                className={`${field} w-20 shrink-0 uppercase`}
                value={formData.prescritor.uf}
                onChange={(e) => setPrescritor('uf', e.target.value.toUpperCase())}
              />
            </div>
            <input
              type="text"
              placeholder="Telefone"
              className={`${field} font-mono`}
              value={formData.prescritor.telefone}
              onChange={(e) => setPrescritor('telefone', e.target.value)}
            />
            <div className="border-t border-line pt-3">
              <AddressFields value={formData.prescritor.endereco} onChange={setPrescritorEndereco} />
            </div>
          </div>
        </section>

        {/* Paciente */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 border-b border-line pb-3 font-display text-lg font-semibold text-ink">
            <UserCog className="h-5 w-5 text-teal" />
            Paciente
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome completo do paciente"
              className={field}
              value={formData.paciente.nome}
              onChange={(e) => setPaciente('nome', e.target.value)}
            />
            <input
              type="text"
              placeholder="CPF (opcional)"
              className={`${field} font-mono`}
              value={formData.paciente.cpf}
              onChange={(e) => setPaciente('cpf', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Idade
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex.: 42 anos"
                  className={`${field} font-mono`}
                  value={formData.paciente.idade}
                  onChange={(e) => setPaciente('idade', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Sexo
                </label>
                <select
                  className={field}
                  value={formData.paciente.sexo}
                  onChange={(e) => setPaciente('sexo', e.target.value as Paciente['sexo'])}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
            <div className="border-t border-line pt-3">
              <AddressFields value={formData.paciente.endereco} onChange={setPacienteEndereco} />
            </div>
          </div>
        </section>
      </div>

      {/* Medicamentos */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <Pill className="h-5 w-5 text-teal" />
            Prescrição
            <span className="font-mono text-xs font-normal text-ink-soft">
              {formData.medicamentos.length}/{MAX_MEDS}
            </span>
          </h2>
          {formData.medicamentos.length < MAX_MEDS && (
            <button
              onClick={addMedication}
              className="flex items-center gap-1 rounded-full bg-teal-tint px-3 py-1.5 text-sm font-semibold text-teal-dark transition-colors hover:bg-teal hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          )}
        </div>

        <div className="space-y-5">
          {formData.medicamentos.map((med, index) => (
            <div key={index} className="rounded-xl border border-line bg-paper p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal font-mono text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink-soft">
                    <ListFilter className="h-4 w-4 text-ink-soft/60" />
                    <select
                      className="bg-transparent font-medium outline-none"
                      onChange={(e) => applyPreset(index, e.target.value)}
                      value=""
                    >
                      <option value="" disabled>
                        Sugestões…
                      </option>
                      {MEDICATION_PRESETS.map((p) => (
                        <option key={p.label} value={p.label}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.medicamentos.length > 1 && (
                  <button
                    onClick={() => removeMedication(index)}
                    className="text-ink-soft/60 transition-colors hover:text-rx-red"
                    title="Remover medicamento"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome do medicamento (DCB)"
                    className={`${field} font-semibold`}
                    value={med.nome}
                    onChange={(e) => handleMedicationChange(index, 'nome', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Dosagem / forma farmacêutica"
                    className={field}
                    value={med.dosagem}
                    onChange={(e) => handleMedicationChange(index, 'dosagem', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-ink-soft">Qtd</label>
                    <input
                      type="number"
                      min={1}
                      className={`${field} w-20 font-mono`}
                      value={med.quantidade}
                      onChange={(e) => handleMedicationChange(index, 'quantidade', Number(e.target.value))}
                    />
                    <span className="text-sm italic text-ink-soft">({med.quantidadeExtenso})</span>
                  </div>
                </div>
                <textarea
                  placeholder="Posologia (instruções de uso)"
                  className={`${field} h-32 resize-none`}
                  value={med.posologia}
                  onChange={(e) => handleMedicationChange(index, 'posologia', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ação */}
      <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-ink-soft">
          <Calendar className="h-5 w-5 text-teal" />
          <span className="text-sm font-semibold">Data</span>
          <input
            type="date"
            className="rounded-lg border border-line px-3 py-2 font-mono text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
            value={formData.data}
            onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))}
          />
        </label>
        <button
          onClick={onPrint}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal px-8 py-3 font-display font-semibold text-white shadow-sm transition-all hover:bg-teal-dark active:scale-[0.98]"
        >
          <Printer className="h-5 w-5" />
          Gerar e imprimir
        </button>
      </div>

      <p className="px-2 text-center text-sm text-ink-soft">
        Esta aplicação não salva dados — tudo permanece no seu navegador.
        <br />
        Válido para Receita de Controle Especial (branca) conforme Portaria 344/98.
      </p>
    </div>
  );
};

export default PrescriptionForm;
