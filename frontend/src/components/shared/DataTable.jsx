import { motion } from 'framer-motion';

export default function DataTable({ data }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b] border border-white/[0.06] rounded-xl shadow-2xl">
      <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02] flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data Preview</span>
        <span className="text-[10px] text-zinc-600 font-mono">Showing first 10 rows</span>
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#09090b] z-10">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2.5 text-[11px] font-bold text-zinc-400 border-b border-white/[0.06] bg-[#0c0c0e] uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {data.slice(0, 10).map((row, i) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="hover:bg-white/[0.02] transition-colors"
              >
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 text-[12px] text-zinc-300 font-mono whitespace-nowrap">
                    {String(row[header])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
