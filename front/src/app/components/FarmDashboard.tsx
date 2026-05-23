import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParams, useNavigate } from 'react-router';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Plus,
  LayoutGrid,
  Droplets,
  Thermometer,
  ArrowLeft,
  TrendingUp,
  Package,
  MapPin,
  Edit3,
  Trash2,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getFarmById, getFarmDashboard } from '../services/farmService';
import { deleteParcela, getParcelas } from '../services/plotService';
import EditFarmForm from './EditFarmForm';
import { ConfirmDialog } from './ConfirmDialog';
import { useAppContext } from '../context/AppContext';
import { Farm, FarmDashboardData } from '../types/farm';
import { ParcelaRead } from '../types/plot';

export const FarmDashboard = () => {
  const navigate = useNavigate();
  const { farmId } = useParams<{ farmId: string }>();
  const { updateFarmInContext } = useAppContext();

  const { isDark } = useTheme();
  const chartGridColor = isDark ? '#374151' : '#e5e7eb';
  const chartTickColor = isDark ? '#9ca3af' : '#6b7280';
  const chartTooltipStyle = isDark
    ? { borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.4)', backgroundColor: '#1f2937', color: '#f9fafb' }
    : { borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  const [farm, setFarm] = useState<Farm | null>(null);
  const [plots, setPlots] = useState<ParcelaRead[]>([]);
  const [dashboard, setDashboard] = useState<FarmDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingDeletePlotId, setPendingDeletePlotId] = useState<number | null>(null);
  const [isDeletingPlot, setIsDeletingPlot] = useState(false);

  const loadFarmDashboard = async () => {
    if (!farmId) {
      setError("Granja no encontrada");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [farmData, farmPlots, farmDashboard] = await Promise.all([
        getFarmById(farmId),
        getParcelas({ granja_id: Number(farmId) }),
        getFarmDashboard(farmId),
      ]);

      setFarm(farmData);
      setPlots(farmPlots);
      setDashboard(farmDashboard);
    } catch (requestError) {
      console.error(requestError);
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFarmDashboard();
  }, [farmId]);

  const handleDeletePlot = async () => {
    if (!pendingDeletePlotId || !farmId) {
      return;
    }

    setIsDeletingPlot(true);
    try {
      await deleteParcela(pendingDeletePlotId);
      setPendingDeletePlotId(null);
      await loadFarmDashboard();
    } catch (requestError) {
      console.error(requestError);
    } finally {
      setIsDeletingPlot(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!farm) {
    return <div className="p-8 text-center text-muted-foreground">Granja no encontrada</div>;
  }

  const resumen = dashboard?.resumen;
  const series = dashboard?.series ?? [];
  const distribucionCultivos = dashboard?.distribucion_cultivos ?? [];
  const latestMeasurementLabel = resumen?.ultima_medicion
    ? new Date(resumen.ultima_medicion).toLocaleString()
    : "Sin mediciones";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ConfirmDialog
        open={pendingDeletePlotId !== null}
        title="Eliminar parcela"
        description="¿Seguro que quieres eliminar esta parcela? Esta acción no se puede deshacer."
        loading={isDeletingPlot}
        onConfirm={() => void handleDeletePlot()}
        onCancel={() => setPendingDeletePlotId(null)}
      />

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <EditFarmForm
            farm={farm}
            onSuccess={(updatedFarm) => {
              setFarm(updatedFarm);
              updateFarmInContext(updatedFarm);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}

      <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 cursor-pointer w-fit" onClick={() => navigate('/farms')}>
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a mis granjas
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{farm.nombre}</h1>
            <div className="mt-1">
              {(() => {
                const parts = (farm.ubicacion_geo || '').split(' (');
                const place = parts[0];
                const coords = parts[1] ? parts[1].replace(')', '') : null;
                return (
                  <>
                    <p className="text-sm font-medium text-muted-foreground">
                      {place || 'Sin ubicación'}
                    </p>
                    {coords && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {coords}
                      </p>
                    )}
                  </>
                );
              })()}
              <p className="mt-1 text-xs text-muted-foreground italic">
                {resumen?.parcelas_count ?? plots.length} parcelas activas
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-muted-foreground hover:text-green-600 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
            title="Editar Granja"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => navigate(`/farms/${farmId}/plots/new`)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5 mr-2 -ml-1" />
          Añadir Parcela
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Parcelas Activas</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{resumen?.parcelas_count ?? plots.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Parcelas registradas en la granja</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Sensores Instalados</CardTitle>
            <Package className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{resumen?.sensores_count ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Sensores ligados a esta granja</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Mediciones Registradas</CardTitle>
            <Database className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{resumen?.mediciones_count ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Última lectura: {latestMeasurementLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Área Total</CardTitle>
            <MapPin className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{resumen?.area_total ?? 0} m²</div>
            <p className="text-xs text-muted-foreground mt-1">{resumen?.parcelas_count ?? plots.length} parcelas activas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-blue-500" />
            Media de Humedad Global
          </h2>
          <div className="h-64 w-full">
            {series.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="colorHumedad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis dataKey="etiqueta" axisLine={false} tickLine={false} tick={{ fill: chartTickColor, fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTickColor, fontSize: 12 }} dx={-10} />
                  <RechartsTooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="humedad_media" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHumedad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-xl border border-dashed border-border bg-muted flex items-center justify-center text-sm text-muted-foreground">
                Aún no hay mediciones de humedad suficientes.
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/40 rounded-xl shadow-sm border border-green-200 dark:border-green-800 p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-green-900/50 rounded-full flex items-center justify-center shadow-sm mb-4">
            <Thermometer className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Temperatura Media</h3>
          <p className="text-4xl font-bold text-green-900 dark:text-green-200 mb-2">
            {resumen?.temperatura_media !== null && resumen?.temperatura_media !== undefined
              ? `${resumen.temperatura_media}°C`
              : "--"}
          </p>
          <div className="text-xs text-green-700 dark:text-green-300 bg-white/60 dark:bg-green-900/40 px-3 py-1.5 rounded-full inline-block mt-2">
            Humedad media: {resumen?.humedad_media !== null && resumen?.humedad_media !== undefined ? `${resumen.humedad_media}%` : "--"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Mediciones</CardTitle>
          </CardHeader>
          <CardContent>
            {series.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="etiqueta" tick={{ fill: chartTickColor }} />
                  <YAxis tick={{ fill: chartTickColor }} />
                  <RechartsTooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="humedad_media" stroke="#16a34a" strokeWidth={2} name="Humedad media (%)" />
                  <Line type="monotone" dataKey="temperatura_media" stroke="#2563eb" strokeWidth={2} name="Temperatura media (°C)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] rounded-xl border border-dashed border-border bg-muted flex items-center justify-center text-sm text-muted-foreground">
                No hay suficientes mediciones para calcular la evolución.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Cultivo</CardTitle>
          </CardHeader>
          <CardContent>
            {distribucionCultivos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribucionCultivos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="nombre" tick={{ fill: chartTickColor }} />
                  <YAxis tick={{ fill: chartTickColor }} />
                  <RechartsTooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="parcelas_count" fill="#16a34a" name="Parcelas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] rounded-xl border border-dashed border-border bg-muted flex items-center justify-center text-sm text-muted-foreground">
                No hay parcelas suficientes para mostrar la distribución.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
        <LayoutGrid className="w-6 h-6 mr-2 text-muted-foreground" />
        Mis Parcelas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plots.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-muted rounded-xl border-2 border-dashed border-border">
            <p className="text-muted-foreground">Aún no tienes parcelas en esta granja.</p>
          </div>
        ) : (
          plots.map((plot) => (
            <div
              key={plot.id}
              onClick={() => navigate(`/farms/${farmId}/plots/${plot.id}`)}
              className="bg-card rounded-xl shadow-sm border border-border p-5 hover:border-green-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                  {plot.tipo_cultivo_nombre ?? 'Sin cultivo'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{plot.tamx}x{plot.tamy}m</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setPendingDeletePlotId(plot.id);
                    }}
                    disabled={isDeletingPlot}
                    className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
                    title="Eliminar parcela"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{plot.nombre}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plot.sensores_count ?? 0} sensores instalados</p>

              <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                <span className="text-muted-foreground">
                  {plot.creado_en ? `Creada ${new Date(plot.creado_en).toLocaleDateString()}` : 'Sin fecha de creación'}
                </span>
                <span className="font-medium text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
