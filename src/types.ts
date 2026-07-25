export interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Prescritor {
  nome: string;
  registro: string;
  /** UF do conselho profissional (ex.: CRM SP). Distinto do UF do endereço. */
  uf: string;
  endereco: Address;
  telefone: string;
}

export type Sexo = 'M' | 'F';

export interface Paciente {
  nome: string;
  cpf: string;
  idade: string;
  sexo: Sexo;
  endereco: Address;
}

export interface Medication {
  nome: string;
  dosagem: string;
  quantidade: number;
  quantidadeExtenso: string;
  posologia: string;
}

export interface PrescriptionData {
  prescritor: Prescritor;
  paciente: Paciente;
  medicamentos: Medication[];
  data: string;
}

export interface MedicationPreset {
  label: string;
  nome: string;
  dosagem: string;
  posologia: string;
}

export const emptyAddress = (): Address => ({
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
});
