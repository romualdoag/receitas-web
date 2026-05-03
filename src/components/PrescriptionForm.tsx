import React, { useState, useEffect } from 'react';
import { User, Clipboard, Pill, Printer, Calendar, Plus, Trash2, ListFilter } from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';

interface Medication {
  nome: string;
  dosagem: string;
  quantidade: number;
  quantidadeExtenso: string;
  posologia: string;
}

interface MedicationPreset {
  label: string;
  nome: string;
  dosagem: string;
  posologia: string;
}

const MEDICATION_PRESETS: MedicationPreset[] = [
  {
    label: 'Mounjaro 2,5mg',
    nome: 'Mounjaro (Tirzepatida)',
    dosagem: '2,5mg/0,5mL - Solução Injetável (4un de 0,5mL)',
    posologia: 'Administrar 1 caneta de 2,5mg, via subcutânea (no abdome, coxa ou braço), 1 vez por semana. Alternar o local de aplicação a cada dose.'
  },
  {
    label: 'Mounjaro 5mg',
    nome: 'Mounjaro (Tirzepatida)',
    dosagem: '5mg/0,5mL - Solução Injetável (4un de 0,5mL)',
    posologia: 'Administrar 1 caneta de 5mg, via subcutânea (no abdome, coxa ou braço), 1 vez por semana. Alternar o local de aplicação a cada dose.'
  },
  {
    label: 'Mounjaro 7,5mg',
    nome: 'Mounjaro (Tirzepatida)',
    dosagem: '7,5mg/0,5mL - Solução Injetável (4un de 0,5mL)',
    posologia: 'Administrar 1 caneta de 7,5mg, via subcutânea (no abdome, coxa ou braço), 1 vez por semana. Alternar o local de aplicação a cada dose.'
  },
  {
    label: 'Mounjaro 10mg',
    nome: 'Mounjaro (Tirzepatida)',
    dosagem: '10mg/0,5mL - Solução Injetável (4un de 0,5mL)',
    posologia: 'Administrar 1 caneta de 10mg, via subcutânea (no abdome, coxa ou braço), 1 vez por semana. Alternar o local de aplicação a cada dose.'
  },
  {
    label: 'Ozempic 0,25mg',
    nome: 'Ozempic (Semaglutida)',
    dosagem: '0,25mg - Sistema de aplicação com 1 caneta e 4 agulhas',
    posologia: 'Administrar 0,25mg por via subcutânea, uma vez por semana, por 4 semanas.'
  },
  {
    label: 'Ozempic 0,5mg',
    nome: 'Ozempic (Semaglutida)',
    dosagem: '0,5mg - Sistema de aplicação com 1 caneta e 4 agulhas',
    posologia: 'Administrar 0,5mg por via subcutânea, uma vez por semana, por 4 semanas.'
  },
  {
    label: 'Ozempic 1mg',
    nome: 'Ozempic (Semaglutida)',
    dosagem: '1,0mg - Sistema de aplicação com 1 caneta e 4 agulhas',
    posologia: 'Administrar 1,0mg por via subcutânea, uma vez por semana, por 4 semanas.'
  },
  {
    label: 'Wegovy 0,25mg',
    nome: 'Wegovy (Semaglutida)',
    dosagem: '0,25mg/0,5mL - Solução Injetável',
    posologia: 'Administrar 0,25mg por via subcutânea, uma vez por semana, conforme esquema de escalonamento de dose.'
  },
  {
    label: 'Wegovy 0,5mg',
    nome: 'Wegovy (Semaglutida)',
    dosagem: '0,5mg/0,5mL - Solução Injetável',
    posologia: 'Administrar 0,5mg por via subcutânea, uma vez por semana, conforme esquema de escalonamento de dose.'
  },
  {
    label: 'Wegovy 1mg',
    nome: 'Wegovy (Semaglutida)',
    dosagem: '1,0mg/0,5mL - Solução Injetável',
    posologia: 'Administrar 1,0mg por via subcutânea, uma vez por semana, conforme esquema de escalonamento de dose.'
  },
  {
    label: 'Wegovy 1,7mg',
    nome: 'Wegovy (Semaglutida)',
    dosagem: '1,7mg/0,75mL - Solução Injetável',
    posologia: 'Administrar 1,7mg por via subcutânea, uma vez por semana, conforme esquema de escalonamento de dose.'
  },
  {
    label: 'Wegovy 2,4mg',
    nome: 'Wegovy (Semaglutida)',
    dosagem: '2,4mg/0,75mL - Solução Injetável',
    posologia: 'Administrar 2,4mg por via subcutânea, uma vez por semana (dose de manutenção).'
  }
];

interface PrescriptionFormProps {
  onDataChange: (data: any) => void;
  onPrint: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onDataChange, onPrint }) => {
  const [formData, setFormData] = useState({
    prescritor: {
      nome: '',
      registro: '',
      uf: '',
      endereco: '',
      telefone: '',
    },
    paciente: {
      nome: '',
      endereco: '',
      cpf: '',
      idade: '',
      sexo: 'M',
    },
    medicamentos: [
      {
        nome: 'Mounjaro (Tirzepatida)',
        dosagem: '5mg/0,5mL - Solução Injetável (4un de 0,5mL)',
        quantidade: 1,
        quantidadeExtenso: 'um',
        posologia: 'Administrar 1 caneta de 5mg, via subcutânea (no abdome, coxa ou braço), 1 vez por semana. Alternar o local de aplicação a cada dose.',
      }
    ] as Medication[],
    data: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handlePrescritorPacienteChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev] as any,
        [field]: value,
      },
    }));
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: any) => {
    const newMedicamentos = [...formData.medicamentos];
    (newMedicamentos[index] as any)[field] = value;

    if (field === 'quantidade') {
      newMedicamentos[index].quantidadeExtenso = numberToWords(Number(value));
    }

    setFormData(prev => ({ ...prev, medicamentos: newMedicamentos }));
  };

  const applyPreset = (index: number, presetLabel: string) => {
    if (!presetLabel) return;
    const preset = MEDICATION_PRESETS.find(p => p.label === presetLabel);
    if (preset) {
      const newMedicamentos = [...formData.medicamentos];
      newMedicamentos[index] = {
        ...newMedicamentos[index],
        nome: preset.nome,
        dosagem: preset.dosagem,
        posologia: preset.posologia
      };
      setFormData(prev => ({ ...prev, medicamentos: newMedicamentos }));
    }
  };

  const addMedication = () => {
    if (formData.medicamentos.length < 3) {
      setFormData(prev => ({
        ...prev,
        medicamentos: [
          ...prev.medicamentos,
          { nome: '', dosagem: '', quantidade: 1, quantidadeExtenso: 'um', posologia: '' }
        ]
      }));
    }
  };

  const removeMedication = (index: number) => {
    if (formData.medicamentos.length > 1) {
      const newMedicamentos = formData.medicamentos.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, medicamentos: newMedicamentos }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 print:hidden">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Clipboard className="text-blue-600 w-8 h-8" />
          Emissor de Receita Branca
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Prescritor */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5 text-blue-500" />
              Dados do Profissional
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome Completo"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.prescritor.nome}
                onChange={(e) => handlePrescritorPacienteChange('prescritor', 'nome', e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Registro (ex: CRM 12345)"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.prescritor.registro}
                  onChange={(e) => handlePrescritorPacienteChange('prescritor', 'registro', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="UF"
                  className="w-20 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none uppercase"
                  maxLength={2}
                  value={formData.prescritor.uf}
                  onChange={(e) => handlePrescritorPacienteChange('prescritor', 'uf', e.target.value.toUpperCase())}
                />
              </div>
              <input
                type="text"
                placeholder="Endereço Completo do Consultório"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.prescritor.endereco}
                onChange={(e) => handlePrescritorPacienteChange('prescritor', 'endereco', e.target.value)}
              />
              <input
                type="text"
                placeholder="Telefone"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.prescritor.telefone}
                onChange={(e) => handlePrescritorPacienteChange('prescritor', 'telefone', e.target.value)}
              />
            </div>
          </section>

          {/* Paciente */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5 text-green-500" />
              Dados do Paciente
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome Completo do Paciente"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.paciente.nome}
                onChange={(e) => handlePrescritorPacienteChange('paciente', 'nome', e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF (opcional)"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.paciente.cpf}
                onChange={(e) => handlePrescritorPacienteChange('paciente', 'cpf', e.target.value)}
              />
              <input
                type="text"
                placeholder="Endereço Residencial"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.paciente.endereco}
                onChange={(e) => handlePrescritorPacienteChange('paciente', 'endereco', e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Idade (opcional)"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.paciente.idade}
                  onChange={(e) => handlePrescritorPacienteChange('paciente', 'idade', e.target.value)}
                />
                <select
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.paciente.sexo}
                  onChange={(e) => handlePrescritorPacienteChange('paciente', 'sexo', e.target.value)}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Medicamentos */}
        <section className="mt-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-500" />
              Prescrição (Máximo 3 itens)
            </h2>
            {formData.medicamentos.length < 3 && (
              <button
                onClick={addMedication}
                className="flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors font-bold"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item
              </button>
            )}
          </div>

          <div className="space-y-8">
            {formData.medicamentos.map((med, index) => (
              <div key={index} className="relative bg-gray-50 p-6 rounded-xl border border-gray-200 group">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                      <span className="bg-purple-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1 text-sm text-gray-600">
                        <ListFilter className="w-4 h-4 text-gray-400" />
                        <select 
                          className="outline-none bg-transparent font-medium"
                          onChange={(e) => applyPreset(index, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Sugestões de Medicamentos...</option>
                          {MEDICATION_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                        </select>
                      </div>
                    </div>
                    {formData.medicamentos.length > 1 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remover medicamento"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nome do Medicamento (DCB)"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none font-bold bg-white"
                      value={med.nome}
                      onChange={(e) => handleMedicationChange(index, 'nome', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Dosagem / Forma Farmacêutica"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                      value={med.dosagem}
                      onChange={(e) => handleMedicationChange(index, 'dosagem', e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-gray-600">Qtd:</label>
                      <input
                        type="number"
                        min={1}
                        className="w-20 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                        value={med.quantidade}
                        onChange={(e) => handleMedicationChange(index, 'quantidade', e.target.value)}
                      />
                      <span className="text-sm text-gray-500 italic">({med.quantidadeExtenso})</span>
                    </div>
                  </div>
                  <textarea
                    placeholder="Posologia (Instruções de uso)"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none h-32 resize-none bg-white"
                    value={med.posologia}
                    onChange={(e) => handleMedicationChange(index, 'posologia', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-between items-center border-t pt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <input
              type="date"
              className="outline-none"
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
            />
          </div>
          <button
            onClick={onPrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Printer className="w-5 h-5" />
            Gerar e Imprimir
          </button>
        </div>
      </div>
      
      <p className="text-center text-gray-500 text-sm">
        Esta aplicação não salva dados. Todas as informações permanecem no seu navegador.
        <br />
        Válido para Receita de Controle Especial (Branca) conforme Portaria 344/98.
      </p>
    </div>
  );
};

export default PrescriptionForm;
