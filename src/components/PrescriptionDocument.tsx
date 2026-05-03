import React from 'react';

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
  medicamento: {
    nome: string;
    dosagem: string;
    quantidade: number;
    quantidadeExtenso: string;
    posologia: string;
  };
  data: string;
}

interface PrescriptionDocumentProps {
  data: PrescriptionData;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ data }) => {
  const renderVia = (titulo: string) => (
    <div className="flex-1 p-8 border border-gray-300 min-h-[50%] flex flex-col">
      <div className="text-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">{titulo}</h2>
        <p className="text-sm font-semibold mt-1">RECEITA DE CONTROLE ESPECIAL</p>
      </div>

      {/* Identificação do Emitente */}
      <div className="mb-6">
        <p className="font-bold text-lg">{data.prescritor.nome}</p>
        <p>{data.prescritor.registro} - {data.prescritor.uf}</p>
        <p className="text-sm">{data.prescritor.endereco}</p>
        <p className="text-sm">Tel: {data.prescritor.telefone}</p>
      </div>

      {/* Identificação do Usuário */}
      <div className="mb-6 p-2 border border-black rounded">
        <p className="text-xs font-bold mb-1 uppercase">Paciente:</p>
        <p className="font-semibold uppercase">{data.paciente.nome}</p>
        <p className="text-sm uppercase">{data.paciente.endereco}</p>
        {data.paciente.idade && <p className="text-sm uppercase">Idade: {data.paciente.idade} | Sexo: {data.paciente.sexo}</p>}
      </div>

      {/* Prescrição */}
      <div className="flex-grow mb-6">
        <p className="text-xs font-bold mb-2 uppercase">Prescrição:</p>
        <div className="ml-4">
          <p className="font-bold text-lg uppercase underline">1) {data.medicamento.nome} {data.medicamento.dosagem}</p>
          <p className="mt-1 font-semibold italic">Quantidade: {data.medicamento.quantidade} ({data.medicamento.quantidadeExtenso})</p>
          <p className="mt-4 text-justify leading-relaxed whitespace-pre-wrap">Uso: {data.medicamento.posologia}</p>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm mb-1">{data.prescritor.endereco.split(',')[1]?.trim() || 'Cidade'}, {new Date(data.data).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="text-center border-t border-black w-64 pt-1">
            <p className="text-xs uppercase">Assinatura e Carimbo do Médico</p>
          </div>
        </div>
      </div>

      {/* Rodapé Farmácia */}
      <div className="mt-8 pt-4 border-t border-dashed grid grid-cols-2 gap-4 text-[10px] uppercase">
        <div className="border p-2 rounded">
          <p className="font-bold mb-1">Identificação do Comprador:</p>
          <p>Nome: _________________________________</p>
          <p className="mt-1">RG: _________________ Tel: _____________</p>
          <p className="mt-1">End: _________________________________</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-bold mb-1">Identificação do Fornecedor:</p>
          <div className="h-full border-b border-black mt-2"></div>
          <p className="mt-1">Data: ___/___/___</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-white print:m-0 flex flex-col gap-4">
      {renderVia("1ª Via - Retenção da Farmácia")}
      <div className="border-t-2 border-dashed my-2 print:my-0"></div>
      {renderVia("2ª Via - Orientação ao Paciente")}
    </div>
  );
};

export default PrescriptionDocument;
