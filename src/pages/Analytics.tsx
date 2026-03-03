// @ts-nocheck
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const COLORS = {
  indigo: "#6366f1",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#ef4444",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
};

const periods = ["Este mes", "Este trimestre", "Este año", "Últimos 12 meses"];

const sparklineData = [62, 65, 68, 70, 72, 74, 71, 75, 76, 78];

const incomeExpensesData = [
  { month: "Abr", ingresos: 98, gastos: 62 },
  { month: "May", ingresos: 112, gastos: 70 },
  { month: "Jun", ingresos: 105, gastos: 68 },
  { month: "Jul", ingresos: 118, gastos: 74 },
  { month: "Ago", ingresos: 124, gastos: 79 },
  { month: "Sep", ingresos: 131, gastos: 82 },
  { month: "Oct", ingresos: 119, gastos: 76 },
  { month: "Nov", ingresos: 138, gastos: 85 },
  { month: "Dic", ingresos: 145, gastos: 91 },
  { month: "Ene", ingresos: 127, gastos: 80 },
  { month: "Feb", ingresos: 135, gastos: 86 },
  { month: "Mar", ingresos: 142, gastos: 89 },
];

const specialtyData = [
  { specialty: "Comercial", rate: 88 },
  { specialty: "Civil", rate: 82 },
  { specialty: "Tributario", rate: 80 },
  { specialty: "Laboral", rate: 75 },
  { specialty: "Familia", rate: 71 },
  { specialty: "Penal", rate: 65 },
];

const distributionData = [
  { name: "Activos", value: 45 },
  { name: "Cerrados Éxito", value: 30 },
  { name: "Cerrados Desfav.", value: 15 },
  { name: "Archivados", value: 10 },
];

const distributionColors = [COLORS.indigo, COLORS.emerald, COLORS.rose, COLORS.amber];

type Attorney = {
  nombre: string;
  especialidad: string;
  casosActivos: number;
  tasaExito: number;
  horasFacturables: number;
  ingresosGenerados: number;
  satisfaccion: number;
};

const attorneys: Attorney[] = [
  {
    nombre: "Claudia Fuentes",
    especialidad: "Comercial",
    casosActivos: 12,
    tasaExito: 91,
    horasFacturables: 184,
    ingresosGenerados: 310,
    satisfaccion: 4.8,
  },
  {
    nombre: "Rodrigo Muñoz",
    especialidad: "Laboral",
    casosActivos: 9,
    tasaExito: 67,
    horasFacturables: 152,
    ingresosGenerados: 218,
    satisfaccion: 3.9,
  },
  {
    nombre: "Valentina Soto",
    especialidad: "Civil",
    casosActivos: 14,
    tasaExito: 83,
    horasFacturables: 201,
    ingresosGenerados: 274,
    satisfaccion: 4.5,
  },
  {
    nombre: "Sebastián Araya",
    especialidad: "Penal",
    casosActivos: 7,
    tasaExito: 62,
    horasFacturables: 130,
    ingresosGenerados: 176,
    satisfaccion: 4.1,
  },
];

type SortKey = keyof Attorney;

const forecastMonths = [
  { label: "Mes 1", uf: 158, confidence: "alta", confidenceColor: COLORS.emerald },
  { label: "Mes 2", uf: 134, confidence: "media", confidenceColor: COLORS.amber },
  { label: "Mes 3", uf: 121, confidence: "baja", confidenceColor: COLORS.rose },
];

const clientsLTV = [
  { name: "TechCorp S.A.", cases: 18, total: 620, lastActive: "2026-02-28" },
  { name: "Inversiones Andes", cases: 11, total: 390, lastActive: "2026-03-01" },
  { name: "Constructora DL", cases: 9, total: 310, lastActive: "2026-01-15" },
  { name: "Minera Sur", cases: 7, total: 245, lastActive: "2025-12-20" },
  { name: "Retail Pacífico", cases: 6, total: 198, lastActive: "2026-02-10" },
];

const insights = [
  {
    icon: Clock,
    color: COLORS.amber,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "Abogado Muñoz tiene 3 casos atrasados >30 días",
  },
  {
    icon: TrendingDown,
    color: COLORS.rose,
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "Tasa de éxito laboral bajó 8% vs trimestre anterior",
  },
  {
    icon: AlertTriangle,
    color: COLORS.violet,
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "Cliente TechCorp genera el 23% de los ingresos - riesgo concentración",
  },
  {
    icon: DollarSign,
    color: COLORS.rose,
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "Facturación pendiente supera 180 días en 4 casos",
  },
];

const MiniSparkline = ({ data }: { data: number[] }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={COLORS.emerald}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

function successColor(rate: number) {
  if (rate >= 70) return "text-emerald-400";
  if (rate >= 50) return "text-amber-400";
  return "text-rose-400";
}

function successBg(rate: number) {
  if (rate >= 70) return "bg-emerald-500/10 text-emerald-400";
  if (rate >= 50) return "bg-amber-500/10 text-amber-400";
  return "bg-rose-500/10 text-rose-400";
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Analytics() {
  const [activePeriod, setActivePeriod] = useState("Este mes");
  const [sortKey, setSortKey] = useState<SortKey>("ingresosGenerados");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const maxLTV = Math.max(...clientsLTV.map((c) => c.total));

  const sortedAttorneys = useMemo(() => {
    return [...attorneys].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-indigo-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-indigo-400" />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            Analytics & Business Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">Métricas estratégicas del estudio</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activePeriod === p
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Tasa de Éxito",
            value: "78%",
            sub: null,
            icon: Target,
            iconColor: "text-emerald-400",
            accent: successColor(78),
            extra: <MiniSparkline data={sparklineData} />,
          },
          {
            label: "Ingresos Mes",
            value: "142 UF",
            sub: "+12% vs mes anterior",
            icon: TrendingUp,
            iconColor: "text-indigo-400",
            accent: "text-emerald-400",
            extra: null,
          },
          {
            label: "Casos Cerrados",
            value: "23",
            sub: "este periodo",
            icon: CheckCircle,
            iconColor: "text-cyan-400",
            accent: "text-white",
            extra: null,
          },
          {
            label: "Tiempo Prom. Resolución",
            value: "8.3 meses",
            sub: null,
            icon: Clock,
            iconColor: "text-amber-400",
            accent: "text-white",
            extra: null,
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex flex-col gap-3 hover:border-slate-600/70 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
            <div className={`text-3xl font-bold tracking-tight ${card.accent}`}>{card.value}</div>
            <div className="flex items-center justify-between">
              {card.sub ? (
                <span className="text-xs text-emerald-400 font-medium">{card.sub}</span>
              ) : (
                <span />
              )}
              {card.extra}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6"
      >
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
          Ingresos vs Gastos (UF)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
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
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#cbd5e1" }}
            />
            <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13, color: "#94a3b8" }} />
            <Area
              type="monotone"
              dataKey="ingresos"
              name="Ingresos (UF)"
              stroke={COLORS.indigo}
              strokeWidth={2.5}
              fill="url(#gradIngresos)"
              dot={false}
              activeDot={{ r: 5, fill: COLORS.indigo }}
            />
            <Line
              type="monotone"
              dataKey="gastos"
              name="Gastos (UF)"
              stroke={COLORS.rose}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: COLORS.rose }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6"
        >
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
            Tasa de Éxito por Especialidad
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={specialtyData}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="specialty"
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#cbd5e1" }}
                formatter={(v: number) => [`${v}%`, "Tasa de éxito"]}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {specialtyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.rate >= 80 ? COLORS.emerald : entry.rate >= 70 ? COLORS.indigo : COLORS.amber}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.4 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6"
        >
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
            Distribución de Casos por Etapa
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {distributionData.map((_, index) => (
                  <Cell key={index} fill={distributionColors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#cbd5e1" }}
                formatter={(v: number) => [`${v}%`, ""]}
              />
              <Legend
                wrapperStyle={{ paddingTop: 12, fontSize: 13, color: "#94a3b8" }}
                formatter={(value) => <span style={{ color: "#94a3b8" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Rendimiento por Abogado
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {(
                  [
                    ["nombre", "Nombre"],
                    ["especialidad", "Especialidad"],
                    ["casosActivos", "Casos Activos"],
                    ["tasaExito", "Tasa Éxito"],
                    ["horasFacturables", "Horas Facturables"],
                    ["ingresosGenerados", "Ingresos (UF)"],
                    ["satisfaccion", "Satisfacción"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="pb-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-200 transition-colors whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {sortedAttorneys.map((a) => (
                <tr key={a.nombre} className="hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-100 whitespace-nowrap">{a.nombre}</td>
                  <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">{a.especialidad}</td>
                  <td className="py-3 pr-4 text-slate-300 text-center">{a.casosActivos}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${successBg(a.tasaExito)}`}>
                      {a.tasaExito}%
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-300 text-center">{a.horasFacturables}h</td>
                  <td className="py-3 pr-4 text-indigo-300 font-medium">{a.ingresosGenerados} UF</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-sm font-semibold ${
                        a.satisfaccion >= 4.5
                          ? "text-emerald-400"
                          : a.satisfaccion >= 4.0
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {a.satisfaccion.toFixed(1)}
                    </span>
                    <span className="text-slate-500 text-xs"> /5</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.56, duration: 0.4 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Proyección de Ingresos
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Proyección basada en casos activos y probabilidad de éxito
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {forecastMonths.map((m) => (
            <div
              key={m.label}
              className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 flex flex-col gap-2"
            >
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{m.label}</span>
              <span className="text-2xl font-bold text-white">{m.uf} UF</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
                style={{ backgroundColor: `${m.confidenceColor}18`, color: m.confidenceColor }}
              >
                Confianza {m.confidence}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 bg-slate-900/40 rounded-lg px-4 py-3">
          <Target className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Calculado con base en honorarios pendientes × probabilidad de resolución por tipo de causa
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.4 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Análisis LTV — Top Clientes
          </h2>
        </div>
        <div className="space-y-3">
          {clientsLTV.map((c) => {
            const pct = Math.round((c.total / maxLTV) * 100);
            const avgPerCase = Math.round(c.total / c.cases);
            return (
              <div key={c.name} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-6 items-center">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{c.name}</p>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-700/60 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: COLORS.cyan }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Casos</p>
                  <p className="text-sm font-semibold text-slate-200">{c.cases}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-sm font-semibold text-cyan-300">{c.total} UF</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Prom/Caso</p>
                  <p className="text-sm font-semibold text-slate-200">{avgPerCase} UF</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Último</p>
                  <p className="text-sm text-slate-400">{c.lastActive}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Alertas e Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`${ins.bg} border ${ins.border} rounded-xl p-4 flex gap-3 items-start`}
            >
              <ins.icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ins.color }} />
              <p className="text-sm text-slate-300 leading-relaxed">{ins.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
