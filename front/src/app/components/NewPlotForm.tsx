import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Save, Maximize, Sprout, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createParcela } from '../services/plotService';

const CROP_TYPES = [
  { id: 'tomate', label: 'Tomate', icon: '🍅' },
  { id: 'lechuga', label: 'Lechuga', icon: '🥬' },
  { id: 'zanahoria', label: 'Zanahoria', icon: '🥕' },
  { id: 'patata', label: 'Patata', icon: '🥔' },
  { id: 'cebolla', label: 'Cebolla', icon: '🧅' },
  { id: 'otro', label: 'Otro...', icon: '🌱' },
];

export const NewPlotForm = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [width, setWidth] = useState<number>(3);
  const [height, setHeight] = useState<number>(3);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [customCropValue, setCustomCropValue] = useState<string>('');

  const estimatedSensors = Math.max(1, Math.floor((width * height) / 4));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmId || !name) return;

    const finalCrop = selectedCrop === "Otro..." ? customCropValue.trim() : selectedCrop;

    if (!finalCrop) {
      // Should not happen due to disabled state, but for safety
      return;
    }

    try {
      // TODO: guardar tipo de cultivo cuando backend lo soporte. Y que añada tmb fecha de creación etc..
      await createParcela({
        granja_id: Number(farmId),
        nombre: name,
        tamx: width,
        tamy: height,
        // TODO: Enviar tipo_cultivo_id (INT) cuando exista el flujo para recuperar los tipos de cultivo de la granja
      });

      navigate(`/farms/${farmId}`);

    } catch (error) {
      console.error("Error creando parcela", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-8 border-b border-border bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-center space-x-3 mb-2">
            <img src="/pwa-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">Nueva Parcela</h1>
          </div>
          <p className="text-muted-foreground mt-2">Configura las dimensiones de tu parcela y selecciona el cultivo.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre de la parcela
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Huerto Norte"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Dimensiones</h3>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Ancho (X metros)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="text-muted-foreground mt-5">✕</div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Largo (Y metros)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                <Maximize className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Recomendación de Sensores</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Con un área de {width * height} m², se recomienda instalar al menos <strong className="font-bold">{estimatedSensors} sensores</strong> para una cobertura óptima. Podrás añadirlos manualmente una vez creada la parcela.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Tipo de Cultivo</h3>

              <div className="flex flex-wrap gap-3">
                {CROP_TYPES.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop.label)}
                    className={twMerge(
                      "flex items-center px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
                      selectedCrop === crop.label
                        ? "bg-green-50 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-300 shadow-sm"
                        : "bg-card border-border text-foreground hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/20"
                    )}
                  >
                    <span className="mr-2 text-lg">{crop.icon}</span>
                    {crop.label}
                    {selectedCrop === crop.label && (
                      <CheckCircle2 className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
              {selectedCrop === "Otro..." && (
                <div className="mt-3 p-4 bg-muted border border-border rounded-xl animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Escribe el nombre del cultivo:</label>
                  <input
                    type="text"
                    placeholder="Ej. Pimiento, Berenjena, etc."
                    value={customCropValue}
                    onChange={(e) => setCustomCropValue(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/farms/${farmId}`)}
              className="mr-4 px-6 py-2.5 border border-border rounded-lg shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedCrop || !name}
              className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Crear Parcela
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
