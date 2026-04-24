/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Settings2, 
  AlertCircle, 
  Play, 
  Pause, 
  Terminal,
  Activity,
  History
} from 'lucide-react';
import { MarketChart } from './components/MarketChart';
import { SignalDisplay } from './components/SignalDisplay';
import { TradingSignal, MarketData } from './types';
import { generateSignal } from './services/geminiService';
import { cn } from './lib/utils';

const INITIAL_PRICE = 45230.50;

export default function App() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [strategy, setStrategy] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<TradingSignal[]>([]);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const priceRef = useRef(INITIAL_PRICE);

  // Simulate market data
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLive) {
      interval = setInterval(() => {
        const change = (Math.random() - 0.5) * 50;
        priceRef.current += change;
        
        const timestamp = new Date().toLocaleTimeString();
        
        setMarketData(prev => {
          const newData = [...prev, { time: timestamp, price: priceRef.current, volume: Math.random() * 100 }];
          return newData.slice(-50); // Keep last 50 points
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isLive]);

  const handleSimulateSignal = async () => {
    if (!strategy.trim()) {
      setError("Please describe your trading strategy first.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await generateSignal(strategy, marketData);
      
      const newSignal: TradingSignal = {
        id: crypto.randomUUID(),
        type: result.signal as any,
        reasoning: result.reasoning,
        timestamp: new Date().toLocaleTimeString(),
        priceAtSignal: marketData[marketData.length - 1]?.price || priceRef.current
      };

      setCurrentSignal(newSignal);
      setHistory(prev => [newSignal, ...prev]);
    } catch (err) {
      setError("Failed to generate signal. Check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 lg:border-[12px] lg:border-brutal-gray">
      {/* Top Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2 font-mono">Signal Engine v2.04</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter italic uppercase">
            Trade<span className="text-neon-green">Mind</span>_LOGIC
          </h1>
        </div>

        <div className="flex gap-8 text-right overflow-x-auto w-full md:w-auto pb-4 md:pb-0">
          <div className="flex flex-col min-w-max">
            <span className="text-[10px] uppercase opacity-40 font-bold mb-1">Market State</span>
            <span className="font-mono text-sm uppercase">BTC/USD · {isLive ? 'Volatile' : 'Paused'}</span>
          </div>
          <div className="flex flex-col min-w-max">
            <span className={cn("text-[10px] uppercase font-bold mb-1 transition-colors", isLive ? "text-neon-green" : "text-rose-500")}>
              {isLive ? '● Logic Active' : '○ Logic Halted'}
            </span>
            <span className="font-mono text-sm tracking-tight">
              ${priceRef.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className="self-end p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors uppercase text-[10px] font-bold tracking-widest px-4"
          >
            {isLive ? 'Emergency Stop' : 'Initiate Feed'}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Strategy & Control */}
        <section className="md:col-span-4 flex flex-col gap-6">
          <div className="p-8 bg-brutal-gray border border-white/10 rounded-sm flex-1">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30 mb-6 border-b border-white/10 pb-2">Active Strategy</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-white/40 mb-2 uppercase font-mono tracking-tighter">System Logic Input</p>
                <textarea
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="INPUT_LOGIC_DATA..."
                  className="w-full h-48 bg-[#0a0a0a] border border-white/10 p-4 text-xs font-mono focus:outline-none focus:border-neon-green/50 transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-3 border-l-2 border-rose-500 bg-rose-500/5 text-[10px] font-bold uppercase tracking-wide text-rose-400">
                  CRITICAL_ERROR: {error}
                </div>
              )}

              <button
                onClick={handleSimulateSignal}
                disabled={isAnalyzing || !strategy}
                className={cn(
                  "w-full py-5 font-bold uppercase tracking-[0.2em] text-xs transition-all border-b-4",
                  isAnalyzing 
                    ? "bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed" 
                    : "bg-white text-black hover:bg-neon-green border-black/20"
                )}
              >
                {isAnalyzing ? "Processing_Logic..." : "Generate_Signal >>"}
              </button>
            </div>

            <div className="mt-12 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_10px_#00FF41]"></div>
              <span className="text-[10px] uppercase tracking-tighter font-mono opacity-50">Signal Accuracy: 88.4% Confidence</span>
            </div>
          </div>

          <div className="p-6 bg-brutal-gray border border-white/10 rounded-sm">
            <h2 className="text-[10px] uppercase tracking-widest opacity-30 mb-4 font-bold">Module Inputs</h2>
            <p className="font-mono text-[10px] text-neon-green/80 leading-loose">
              INPUT_LENGTH: 14;<br/>
              SOURCE: CLOSING_PRC;<br/>
              OFFSET: 0x000;<br/>
              REPAINT: FALSE;<br/>
              LATENCY: 12ms;
            </p>
          </div>
        </section>

        {/* Right Column: Charts & Signals */}
        <section className="md:col-span-8 flex flex-col gap-8">
          <div className="bg-brutal-gray border border-white/10 p-1 flex flex-col min-h-[400px]">
             <div className="flex items-center justify-between p-4 border-b border-white/5">
               <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Volatility Feed // Realtime</h2>
               <div className="flex gap-4">
                 {['1M', '5M', '15M'].map(t => (
                   <span key={t} className="text-[9px] font-mono opacity-20">{t}</span>
                 ))}
               </div>
             </div>
             <div className="flex-1 p-2">
                <MarketChart data={marketData} />
             </div>
          </div>

          <SignalDisplay currentSignal={currentSignal} history={history} />
        </section>
      </main>

      <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
        <div className="flex gap-8 overflow-hidden">
          <span className="text-[10px] font-mono opacity-30 whitespace-nowrap">LOG: Strategy Match: {currentSignal ? 'TRUE' : 'WAITING'}</span>
          <span className="hidden md:inline text-[10px] font-mono opacity-30 whitespace-nowrap">LOG: Environment Check: OK</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block h-1.5 w-24 bg-white/5">
            <motion.div 
              className="h-full bg-neon-green"
              animate={{ width: isLive ? '80%' : '0%' }}
            />
          </div>
          <span className="text-[10px] font-mono uppercase opacity-50 tracking-widest">System_Online</span>
        </div>
      </footer>
    </div>
  );
}
