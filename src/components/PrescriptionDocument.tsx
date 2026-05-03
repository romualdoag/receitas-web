import React from 'react';

interface Medication {
  nome: string;
  dosagem: string;
  quantidade: number;
  quantidadeExtenso: string;
  posologia: string;
}

interface PrescriptionData {
  prescritor: {
    nome: string;
    registro: string;
    uf: string;
    endereco: string;
    telefone: string;
  };
  paciente: {
    nome: string;
    endereco: string;
    idade?: string;
    sexo?: string;
  };
  medicamentos: Medication[];
  data: string;
}

interface PrescriptionDocumentProps {
  data: PrescriptionData;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ data }) => {
  const renderVia = (titulo: string, isFirstVia: boolean) => (
    <div className={`p-12 bg-white flex flex-col h-[297mm] ${isFirstVia ? 'break-after-page' : ''}`}>
      <div className="text-center mb-10 border-b-2 border-black pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-widest">{titulo}</h2>
        <p className="text-sm font-bold mt-1">RECEITA DE CONTROLE ESPECIAL</p>
      </div>

      {/* Identificação do Emitente */}
      <div className="mb-8 min-h-[80px]">
        <p className="font-bold text-xl uppercase">{data.prescritor.nome || '__________________________________________'}</p>
        <p className="font-semibold">{data.prescritor.registro} {data.prescritor.uf}</p>
        <p className="text-sm">{data.prescritor.endereco}</p>
        {data.prescritor.telefone && <p className="text-sm">Tel: {data.prescritor.telefone}</p>}
      </div>

      {/* Identificação do Usuário */}
      <div className="mb-8 p-4 border-2 border-black rounded-lg">
        <p className="text-xs font-black mb-1 uppercase tracking-tighter">Paciente:</p>
        <p className="font-bold text-lg uppercase">{data.paciente.nome || '_____________________________________________________'}</p>
        <p className="text-sm uppercase mt-1">{data.paciente.endereco || '_____________________________________________________'}</p>
        {(data.paciente.idade || data.paciente.sexo) && (
          <p className="text-sm uppercase mt-1 font-semibold">
            {data.paciente.idade && `Idade: ${data.paciente.idade}`} 
            {data.paciente.idade && data.paciente.sexo && ' | '}
            {data.paciente.sexo && `Sexo: ${data.paciente.sexo}`}
          </p>
        )}
      </div>

      {/* Prescrição */}
      <div className="flex-grow mb-8">
        <p className="text-xs font-black mb-4 uppercase tracking-tighter">Prescrição:</p>
        <div className="space-y-6">
          {data.medicamentos.map((med, index) => (
            <div key={index} className="ml-2">
              <p className="font-bold text-lg uppercase underline decoration-2 underline-offset-4">
                {index + 1}) {med.nome} {med.dosagem}
              </p>
              <p className="mt-1 font-bold italic text-base">
                Quantidade: {med.quantidade} ({med.quantidadeExtenso})
              </p>
              <div className="mt-2 text-base text-justify leading-snug whitespace-pre-wrap font-medium">
                Uso: {med.posologia}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end mb-10">
          <div className="pb-2">
            <p className="text-base font-bold">
              {data.prescritor.endereco.split(',')[1]?.trim() || 'Cidade'}, {new Date(data.data).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="text-center border-t-2 border-black w-80 pt-2">
            <p className="text-xs font-bold uppercase">Assinatura e Carimbo do Médico</p>
          </div>
        </div>

        {/* Rodapé Farmácia */}
        <div className="pt-6 border-t-2 border-black grid grid-cols-2 gap-6 text-[11px] font-bold uppercase">
          <div className="border-2 border-black p-3 rounded-lg">
            <p className="mb-2 border-b border-black pb-1">Identificação do Comprador:</p>
            <p className="mt-2">Nome: _________________________________</p>
            <p className="mt-2">RG: _________________ Tel: _____________</p>
            <p className="mt-2">End: _________________________________</p>
          </div>
          <div className="border-2 border-black p-3 rounded-lg flex flex-col">
            <p className="mb-2 border-b border-black pb-1">Identificação do Fornecedor:</p>
            <div className="flex-grow mt-4 border-b border-black border-dotted"></div>
            <p className="mt-4">Data: ____/____/____</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white print:p-0">
      {renderVia("1ª Via - Retenção da Farmácia", true)}
      {renderVia("2ª Via - Orientação ao Paciente", false)}
    </div>
  );
};

export default PrescriptionDocument;
