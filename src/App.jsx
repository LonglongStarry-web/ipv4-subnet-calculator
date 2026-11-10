import React, { useState, useEffect } from 'react';
import { calculateSubnet, toBinaryString } from './subnet.js';



    // 图标组件 (替换掉原来的外部依赖)
    const CpuIcon = ({ className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
    );
    const ShieldAlertIcon = ({ className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6 2a1 1 0 0 1 1 1v7z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
    );
    const InfoIcon = ({ className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    );

    function App() {
      const [octets, setOctets] = useState(['192', '168', '1', '100']);
      const [cidr, setCidr] = useState(24);
      const [results, setResults] = useState(null);

      useEffect(() => {
        try {
          setResults(calculateSubnet(octets.join('.'), cidr));
        } catch {
          setResults(null);
        }
      }, [octets, cidr]);

      const handleOctetChange = (index, value) => {
        const newOctets = [...octets];
        if (value === '') {
          newOctets[index] = '';
        } else {
          const num = /^\d+$/.test(value) ? Number(value) : NaN;
          if (!isNaN(num) && num >= 0 && num <= 255) newOctets[index] = num.toString();
        }
        setOctets(newOctets);
      };

      const renderBinaryArray = (intVal, highlightNetwork = false) => {
        const binStr = toBinaryString(intVal);
        return (
          <div className="flex flex-wrap gap-[2px] font-mono text-xs sm:text-sm md:text-base mt-1">
            {binStr.split('').map((bit, idx) => {
              const isNetworkBit = idx < cidr;
              const addDot = idx === 7 || idx === 15 || idx === 23;
              let bgColor = 'bg-slate-700 text-slate-300';
              if (highlightNetwork) {
                bgColor = isNetworkBit 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
              }
              return (
                <React.Fragment key={idx}>
                  <span className={`flex items-center justify-center w-[14px] h-[20px] sm:w-5 sm:h-6 md:w-6 md:h-7 rounded-sm ${bgColor}`}>
                    {bit}
                  </span>
                  {addDot && <span className="text-slate-400 font-bold mx-[1px] sm:mx-1 flex items-end pb-1">.</span>}
                  {idx === cidr - 1 && cidr !== 32 && cidr !== 0 && (
                    <div className="w-[2px] h-6 sm:h-8 bg-orange-500 mx-[1px] sm:mx-[2px] shadow-[0_0_8px_rgba(249,115,22,0.8)] z-10"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      };



      return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2 sm:gap-3">
              <CpuIcon className="text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />
              IP 网段与掩码推演
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">直观理解网络位与主机位的二进制划分</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-medium text-slate-400">IP 地址 (IPv4)</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  {octets.map((octet, idx) => (
                    <React.Fragment key={idx}>
                      <input
                        aria-label={`IPv4 第 ${idx + 1} 段`} type="number" min="0" max="255" step="1" value={octet}
                        onChange={(e) => handleOctetChange(idx, e.target.value)}
                        className="w-14 sm:w-20 bg-slate-900 border border-slate-600 rounded-lg text-center py-2 text-base sm:text-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none text-white"
                      />
                      {idx < 3 && <span className="text-slate-400 font-bold text-lg sm:text-xl">.</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="block text-xs sm:text-sm font-medium text-slate-400">子网掩码 (CIDR)</label>
                  <div className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">/{cidr}</div>
                </div>
                <input
                  aria-label="CIDR 前缀长度" type="range" min="0" max="32" value={cidr}
                  onChange={(e) => setCidr(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-right text-xs sm:text-sm font-mono text-slate-400">{results?.maskStr || '请输入完整地址'}</div>
              </div>
            </div>
          </div>

          {results ? <>
          <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-700 overflow-x-auto">
            <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldAlertIcon className="text-orange-400 w-4 h-4 sm:w-5 sm:h-5" />
              底层二进制计算 (AND 运算)
            </h2>
            
            <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2"><span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-500/20 border border-blue-500/50"></span><span className="text-blue-300">网络部分</span></div>
              <div className="flex items-center gap-1 sm:gap-2"><span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></span><span className="text-emerald-300">主机部分</span></div>
            </div>

            <div className="space-y-4 min-w-[300px]">
              <div>
                <div className="text-slate-400 text-xs sm:text-sm mb-1 font-mono">IP 地址</div>
                {renderBinaryArray(results.ipInt, true)}
              </div>
              <div>
                <div className="text-slate-400 text-xs sm:text-sm mb-1 font-mono">子网掩码</div>
                {renderBinaryArray(results.maskInt, true)}
              </div>
              <div className="border-t border-slate-700 border-dashed my-2"></div>
              <div>
                <div className="text-blue-400 text-xs sm:text-sm font-bold mb-1 font-mono">网络地址</div>
                {renderBinaryArray(results.networkInt, true)}
                <div className="mt-2 text-xs sm:text-sm text-slate-400 flex items-start sm:items-center gap-1">
                  <InfoIcon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 mt-[2px] sm:mt-0" />
                  按位与(AND)运算：只有当 IP 和掩码对应位都为 1 时，结果才为 1。主机位全被清零。
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="网络地址 (起点)" value={results.networkStr} color="border-blue-500/30" />
            <StatCard title={cidr >= 31 ? "地址块终点（无广播）" : "广播地址 (终点)"} value={results.broadcastStr} color="border-purple-500/30" />
            <StatCard title="可用主机数量" value={results.usableCount.toLocaleString()} color="border-emerald-500/30" isHighlight />
            <StatCard title="可用 IP 范围" value={results.usableRange} color="border-amber-500/30" />
          </div>
          </> : <p role="alert">请填写四段完整的 IPv4 地址（每段 0–255）。</p>}
        </div>
      );
    }

    function StatCard({ title, value, color, isHighlight }) {
      return (
        <div className={`bg-slate-800 rounded-xl p-4 border-t-4 shadow-lg ${color}`}>
          <h3 className="text-slate-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">{title}</h3>
          <div className={`text-base sm:text-lg md:text-xl font-bold font-mono break-words ${isHighlight ? 'text-emerald-400' : 'text-slate-100'}`}>
            {value}
          </div>
        </div>
      );
    }


export default App;
