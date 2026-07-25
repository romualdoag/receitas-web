import React from 'react';
import type { PrescriptionData } from '../types';
import { formatEndereco } from '../utils/format';

interface PrescriptionDocumentProps {
  data: PrescriptionData;
}

const LINE = '__________________________________________________';

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ data }) => {
  const enderecoPrescritor = formatEndereco(data.prescritor.endereco);
  const enderecoPaciente = formatEndereco(data.paciente.endereco);
  const cidadeData = data.prescritor.endereco.cidade || 'Cidade';
  const dataFmt = data.data
    ? new Date(`${data.data}T00:00:00`).toLocaleDateString('pt-BR')
    : '__/__/____';

  const renderVia = (titulo: string, isFirstVia: boolean) => (
    // Cada via preenche no mínimo uma folha A4 (min-h) e SEMPRE começa em página
    // nova (break-before na 2ª via). Nunca truncamos: se o conteúdo exceder a
    // folha ele reflui para páginas extras — perder texto numa receita de
    // controle especial a invalida. break-inside-avoid mantém blocos íntegros.
    <div
      className={`mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white p-[15mm] text-ink ${
        isFirstVia ? '' : 'break-before-page'
      }`}
    >
      <div className="mb-8 break-inside-avoid border-b-2 border-black pb-4 text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-widest">{titulo}</h2>
        <p className="mt-1 font-mono text-sm font-semibold uppercase tracking-wide">
          Receita de Controle Especial
        </p>
      </div>

      {/* Identificação do Emitente */}
      <div className="mb-6 min-h-[72px] break-inside-avoid">
        <p className="font-display text-xl font-bold uppercase leading-tight">
          {data.prescritor.nome || LINE}
        </p>
        <p className="font-mono text-sm font-semibold">
          {[
            [data.prescritor.conselho, data.prescritor.uf].filter(Boolean).join('/'),
            data.prescritor.registro,
          ]
            .filter(Boolean)
            .join(' ')}
        </p>
        {enderecoPrescritor && <p className="text-sm leading-snug">{enderecoPrescritor}</p>}
        {data.prescritor.telefone && (
          <p className="font-mono text-sm">Tel: {data.prescritor.telefone}</p>
        )}
      </div>

      {/* Identificação do Usuário */}
      <div className="mb-6 break-inside-avoid rounded-lg border-2 border-black p-4">
        <p className="mb-1 text-xs font-black uppercase tracking-tighter">Paciente:</p>
        <p className="text-lg font-bold uppercase leading-tight">{data.paciente.nome || LINE}</p>
        <p className="mt-1 break-words text-sm uppercase leading-snug">
          {enderecoPaciente || LINE}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold uppercase">
          {data.paciente.cpf && <span className="font-mono">CPF: {data.paciente.cpf}</span>}
          {data.paciente.idade && <span>Idade: {data.paciente.idade}</span>}
          {data.paciente.sexo && <span>Sexo: {data.paciente.sexo}</span>}
        </div>
      </div>

      {/* Prescrição — área elástica; cresce e reflui, nunca corta o texto */}
      <div className="mb-6 flex-grow">
        <p className="mb-4 text-xs font-black uppercase tracking-tighter">Prescrição:</p>
        <div className="space-y-5">
          {data.medicamentos.map((med, index) => (
            <div key={index} className="ml-2 break-inside-avoid">
              <p className="text-lg font-bold uppercase underline decoration-2 underline-offset-4">
                {index + 1}) {med.nome} {med.dosagem}
              </p>
              <p className="mt-1 font-mono text-base font-bold italic">
                Quantidade: {med.quantidade} ({med.quantidadeExtenso})
              </p>
              <div className="mt-2 whitespace-pre-wrap break-words text-justify text-base font-medium leading-snug">
                Uso: {med.posologia}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto break-inside-avoid">
        <div className="mb-10 flex items-end justify-between">
          <p className="pb-2 text-base font-bold">
            {cidadeData}, {dataFmt}
          </p>
          <div className="w-80 border-t-2 border-black pt-2 text-center">
            <p className="text-xs font-bold uppercase">Assinatura e Carimbo do Médico</p>
          </div>
        </div>

        {/* Rodapé Farmácia — obrigatório na receita de controle especial */}
        <div className="grid grid-cols-2 gap-6 border-t-2 border-black pt-6 text-[11px] font-bold uppercase">
          <div className="rounded-lg border-2 border-black p-3">
            <p className="mb-2 border-b border-black pb-1">Identificação do Comprador:</p>
            <p className="mt-2">Nome: _________________________________</p>
            <p className="mt-2">RG: _________________ Tel: _____________</p>
            <p className="mt-2">End: _________________________________</p>
          </div>
          <div className="flex flex-col rounded-lg border-2 border-black p-3">
            <p className="mb-2 border-b border-black pb-1">Identificação do Fornecedor:</p>
            <div className="mt-4 flex-grow border-b border-dotted border-black" />
            <p className="mt-4">Data: ____/____/____</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white print:p-0">
      {renderVia('1ª Via - Retenção da Farmácia', true)}
      {renderVia('2ª Via - Orientação ao Paciente', false)}
    </div>
  );
};

export default PrescriptionDocument;
