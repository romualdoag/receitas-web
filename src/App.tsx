import { useState, useCallback } from 'react';
import PrescriptionForm from './components/PrescriptionForm';
import PrescriptionDocument from './components/PrescriptionDocument';

function App() {
  const [prescriptionData, setPrescriptionData] = useState<any>(null);

  const handleDataChange = useCallback((data: any) => {
    setPrescriptionData(data);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Formulário visível apenas na tela */}
      <div className="print:hidden py-10">
        <PrescriptionForm onDataChange={handleDataChange} onPrint={handlePrint} />
      </div>

      {/* Documento visível apenas na impressão (e opcionalmente um preview na tela se quisermos) */}
      <div className="hidden print:block bg-white min-h-screen">
        {prescriptionData && <PrescriptionDocument data={prescriptionData} />}
      </div>
      
      {/* Preview opcional no final da página para desktop */}
      <div className="print:hidden max-w-4xl mx-auto pb-20 px-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 px-2">Visualização Prévia:</h3>
        <div className="bg-white shadow-2xl origin-top scale-[0.7] sm:scale-[0.8] md:scale-100 transition-transform">
           {prescriptionData && <PrescriptionDocument data={prescriptionData} />}
        </div>
      </div>
    </div>
  );
}

export default App;
