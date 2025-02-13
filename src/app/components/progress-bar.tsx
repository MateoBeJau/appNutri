interface Props {
    step: number;
  }
  
  export const ProgressBar = ({ step }: Props) => {
    const progressWidth = step === 1 ? "w-0" : step === 2 ? "w-1/2" : "w-full"; // Ahora comienza en 0 y avanza en 3 etapas
  
    return (
      <div className="relative w-full h-3 bg-gray-200 rounded-md mb-6">
        {/* Barra de progreso */}
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-md shadow-lg ${progressWidth}`}
        ></div>
  
        {/* Indicadores de pasos */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-2">
          <div
            className={`h-6 w-6 rounded-full transition-all duration-500 ease-in-out ${
              step >= 1 ? "bg-emerald-500" : "bg-gray-300"
            } border-2 border-white shadow-md transform -translate-y-1/2`}
          ></div>
          <div
            className={`h-6 w-6 rounded-full transition-all duration-500 ease-in-out ${
              step >= 2 ? "bg-emerald-500" : "bg-gray-300"
            } border-2 border-white shadow-md transform -translate-y-1/2`}
          ></div>
          <div
            className={`h-6 w-6 rounded-full transition-all duration-500 ease-in-out ${
              step === 3 ? "bg-emerald-500" : "bg-gray-300"
            } border-2 border-white shadow-md transform -translate-y-1/2`}
          ></div>
        </div>
      </div>
    );
  };
  