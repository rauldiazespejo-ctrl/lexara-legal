// @ts-nocheck
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, BarChart2, DollarSign, AlertTriangle,
  CheckCircle, Clock, Target, ChevronUp, ChevronDown,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";

const COLORS = {
  indigo: "#6366f1",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#ef4444",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
};

const periods = ["Este mes", "Este trimestre", "Este año", "Últimos 12 meses"];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

function successColor(rate: number) {
  if (rate >= 70) return "text-emerald-400";
  if (rate >= 50) return "text-amber-400";
  return "text-rose-400";
}

function formatUF(n: number) {
  return n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " UF";
}

export default function Analytics() {
  const { casos, clientes, honorarios, plazos, abogados } = useAppData();
  const [activePeriod, setActivePeriod] = useState("Este mes");
  const [sortKey, setSortKey] = useState("casosActivos");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const casosActivos = casos.filter(c => c.estado === "activo" || c.estado === "Activo").length;
  const casosCerrados = casos.filter(c => c.estado === "cerrado" || c.estado === "Cerrado" || c.estado === "Ganado").length;
  const casosGanados = casos.filter(c => c.estado === "Ganado" || c.estado === "ganado").length;
  const tasaExito = casosCerrados > 0 ? Math.round((casosGanados / casosCerrados) * 100) : 0;
  const totalClientes = clientes.length;

  const ingresosTotal = honorarios.reduce((s, h) => s + (h.montoUF ?? 0), 0);
  const ingresosPagados = honorarios.filter(h => h.estado === "pagado").reduce((s, h) => s + (h.montoUF ?? 0), 0);

  const plazosUrgentes = plazos.filter(p => p.alerta === "critical" || p.alerta === "high").length;

  const especialidadesCount: Record<string, { total: number; ganados: number }> = {};
  casos.forEach(c => {
    const esp = c.especialidad || c.materia || "General";
    if (!especialidadesCount[esp]) especialidadesCount[esp] = { total: 0, ganados: 0 };
    especialidadesCount[esp].total++;
    if (c.estado === "Ganado" || c.estado === "ganado") especialidadesCount[esp].ganados++;
  });
  const specialtyData = Object.entries(especialidadesCount).map(([esp, d]) => ({
    specialty: esp,
    rate: d.total > 0 ? Math.round((d.ganados / d.total) * 100) : 0,
    total: d.total,
  })).sort((a, b) => b.total - a.total).slice(0, 6);

  const distributionData = [
    { name: "Activos", value: casosActivos || 0 },
    { name: "Cerrados éxito", value: casosGanados || 0 },
    { name: "Cerrados desfav.", value: Math.max(0, casosCerrados - casosGanados) },
    { name: "Otros", value: Math.max(0, casos.length - casosActivos - casosCerrados) },
  ].filter(d => d.value > 0);
  const distributionColors = [COLORS.indigo, COLORS.emerald, COLORS.rose, COLORS.amber];

  const now = new Date();
  const incomeByMonth: Record<string, number> = {};
  honorarios.forEach(h => {
    const fecha = h.fecha ? new Date(h.fecha) : null;
    if (!fecha) return;
    const key = fecha.toLocaleString("es-CL", { month: "short" });
    incomeByMonth[key] = (incomeByMonth[key] ?? 0) + (h.montoUF ?? 0);
  });
  const incomeExpensesData = Object.entries(incomeByMonth).slice(-12).map(([month, ingresos]) => ({
    month,
    ingresos: Math.round(ingresos * 10) / 10,
    gastos: Math.round(ingresos * 0.6 * 10) / 10,
  }));

  const abogadosStats = abogados.map(a => {
    const casosAbogado = casos.filter(c => c.abogadoId === a.id || c.abogado === a.nombre);
    const ganados = casosAbogado.filter(c => c.estado === "Ganado").length;
    return {
      nombre: a.nombre,
      especialidad: a.especialidad ?? "General",
      casosActivos: casosAbogado.filter(c => c.estado === "activo" || c.estado === "Activo").length,
      tasaExito: casosAbogado.length > 0 ? Math.round((ganados / casosAbogado.length) * 100) : 0,
      ingresosGenerados: honorarios.filter(h => h.abogadoId === a.id).reduce((s, h) => s + (h.montoUF ?? 0), 0),
    };
  });

  const sortedAbogados = useMemo(() => {
    return [...abogadosStats].sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [abogadosStats, sortKey, sortDir]);

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const hasData = casos.length > 0 || honorarios.length > 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 sm:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            Analytics & Business Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {hasData ? "Métricas basadas en datos reales del estudio" : "Carga casos y honorarios para ver métricas reales"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {periods.map(p => (
            <button key={p} onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activePeriod === p ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"}`}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {!hasData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl p-6 text-center space-y-2"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <BarChart2 className="w-10 h-10 text-indigo-500/40 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Sin datos aún</p>
          <p className="text-xs text-slate-600">Agrega casos, honorarios y clientes para ver métricas reales aquí</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Casos Activos", value: casosActivos.toString(), sub: `${casos.length} total`, icon: Target, iconColor: "text-indigo-400", accent: "text-white" },
          { label: "Tasa de Éxito", value: `${tasaExito}%`, sub: `${casosCerrados} cerrados`, icon: CheckCircle, iconColor: "text-emerald-400", accent: successColor(tasaExito) },
          { label: "Ingresos Totales", value: formatUF(ingresosTotal), sub: `${formatUF(ingresosPagados)} cobrado`, icon: DollarSign, iconColor: "text-amber-400", accent: "text-amber-400" },
          { label: "Plazos Urgentes", value: plazosUrgentes.toString(), sub: `${plazos.length} plazos totales`, icon: AlertTriangle, iconColor: plazosUrgentes > 0 ? "text-red-400" : "text-slate-500", accent: plazosUrgentes > 0 ? "text-red-400" : "text-slate-400" },
        ].map((card, i) => (
          <motion.div key={card.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-2 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${card.accent}`}>{card.value}</div>
            {card.sub && <span className="text-xs text-slate-500">{card.sub}</span>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Clientes</span>
          <span className="text-2xl font-bold text-white">{totalClientes}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Abogados</span>
          <span className="text-2xl font-bold text-white">{abogados.length}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Honorarios pendientes</span>
          <span className="text-2xl font-bold text-amber-400">{formatUF(ingresosTotal - ingresosPagados)}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Plazos este mes</span>
          <span className="text-2xl font-bold text-white">{plazos.length}</span>
        </motion.div>
      </div>

      {incomeExpensesData.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Ingresos vs Gastos (UF)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={incomeExpensesData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="ingresos" name="Ingresos (UF)" stroke={COLORS.indigo} strokeWidth={2.5} fill="url(#gradIngresos)" dot={false} />
              <Area type="monotone" dataKey="gastos" name="Estimado gastos (UF)" stroke={COLORS.rose} strokeWidth={2} fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {specialtyData.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Casos por Especialidad</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={specialtyData} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="specialty" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="total" name="Total casos" fill={COLORS.indigo} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : null}

        {distributionData.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Distribución de Casos</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {distributionData.map((_, index) => (
                    <Cell key={index} fill={distributionColors[index % distributionColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        ) : null}
      </div>

      {sortedAbogados.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Desempeño por Abogado</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {[
                    { key: "nombre", label: "Abogado" },
                    { key: "especialidad", label: "Especialidad" },
                    { key: "casosActivos", label: "Activos" },
                    { key: "tasaExito", label: "Éxito %" },
                    { key: "ingresosGenerados", label: "Ingresos (UF)" },
                  ].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)}
                      className="text-left py-2 px-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300 transition-colors select-none">
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-indigo-400" /> : <ChevronDown className="w-3 h-3 text-indigo-400" />) : <ChevronUp className="w-3 h-3 opacity-20" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedAbogados.map((a, i) => (
                  <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="py-2.5 px-3 text-slate-200 font-medium">{a.nombre}</td>
                    <td className="py-2.5 px-3 text-slate-400">{a.especialidad}</td>
                    <td className="py-2.5 px-3 text-slate-300">{a.casosActivos}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${a.tasaExito >= 70 ? 'bg-emerald-500/10 text-emerald-400' : a.tasaExito >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {a.tasaExito}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{a.ingresosGenerados.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
