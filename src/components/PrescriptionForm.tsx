import React, { useState, useEffect } from 'react';
import { User, Clipboard, Pill, Printer, Calendar } from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';

interface PrescriptionFormProps {
  onDataChange: (data: any) => void;
  onPrint: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onDataChange, onPrint }) => {
  const [formData, setFormData] = useState({
    prescritor: {
      nome: '',
      registro: 'CRM',
      uf: 'SP',
      endereco: '',
      telefone: '',
    },
    paciente: {
      nome: '',
      endereco: '',
      idade: '',
      sexo: 'M',
    },
    medicamento: {
      nome: '',
      dosagem: '',
      quantidade: 1,
      quantidadeExtenso: 'um',
      posologia: '',
    },
    data: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev] as any,
          [field]: value,
        },
      };

      if (section === 'medicamento' && field === 'quantidade') {
        newData.medicamento.quantidadeExtenso = numberToWords(Number(value));
      }

      return newData;
    });
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
                onChange={(e) => handleChange('prescritor', 'nome', e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Registro (ex: CRM 12345)"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.prescritor.registro}
                  onChange={(e) => handleChange('prescritor', 'registro', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="UF"
                  className="w-20 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none uppercase"
                  maxLength={2}
                  value={formData.prescritor.uf}
                  onChange={(e) => handleChange('prescritor', 'uf', e.target.value.toUpperCase())}
                />
              </div>
              <input
                type="text"
                placeholder="Endereço Completo do Consultório"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.prescritor.endereco}
                onChange={(e) => handleChange('prescritor', 'endereco', e.target.value)}
              />
              <input
                type="text"
                placeholder="Telefone"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.prescritor.telefone}
                onChange={(e) => handleChange('prescritor', 'telefone', e.target.value)}
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
                onChange={(e) => handleChange('paciente', 'nome', e.target.value)}
              />
              <input
                type="text"
                placeholder="Endereço Residencial"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.paciente.endereco}
                onChange={(e) => handleChange('paciente', 'endereco', e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Idade (opcional)"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.paciente.idade}
                  onChange={(e) => handleChange('paciente', 'idade', e.target.value)}
                />
                <select
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.paciente.sexo}
                  onChange={(e) => handleChange('paciente', 'sexo', e.target.value)}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Medicamento */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Pill className="w-5 h-5 text-purple-500" />
            Prescrição
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do Medicamento (DCB)"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                value={formData.medicamento.nome}
                onChange={(e) => handleChange('medicamento', 'nome', e.target.value)}
              />
              <input
                type="text"
                placeholder="Dosagem / Forma Farmacêutica"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.medicamento.dosagem}
                onChange={(e) => handleChange('medicamento', 'dosagem', e.target.value)}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-600">Qtd:</label>
                <input
                  type="number"
                  min={1}
                  className="w-20 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData.medicamento.quantidade}
                  onChange={(e) => handleChange('medicamento', 'quantidade', e.target.value)}
                />
                <span className="text-sm text-gray-500 italic">({formData.medicamento.quantidadeExtenso})</span>
              </div>
            </div>
            <textarea
              placeholder="Posologia (Instruções de uso)"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none h-32 resize-none"
              value={formData.medicamento.posologia}
              onChange={(e) => handleChange('medicamento', 'posologia', e.target.value)}
            />
          </div>
        </section>

        <div className="mt-8 flex justify-between items-center border-t pt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <input
              type="date"
              className="outline-none"
              value={formData.data}
              onChange={(e) => handleChange('', 'data', e.target.value)}
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
