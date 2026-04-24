import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Clock, Info } from 'lucide-react';
import { TradingSignal } from '../types';
import { cn } from '../lib/utils';

interface SignalDisplayProps {
  currentSignal: TradingSignal | null;
  history: TradingSignal[];
}

export const SignalDisplay: React.FC<SignalDisplayProps> = ({ currentSignal, history }) => {
  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence mode="wait">
        {currentSignal && (
          <motion.div
            key={currentSignal.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn(
              "relative overflow-hidden rounded-sm p-8 min-h-[300px] flex flex-col justify-between",
              currentSignal.type === 'BUY' && "bg-neon-green text-black",
              currentSignal.type === 'SELL' && "bg-rose-500 text-white",
              currentSignal.type === 'WAIT' && "bg-white text-black"
            )}
          >
            {/* Background Percentage Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl italic select-none">
              88%
            </div>

            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-current pb-1">
                Live Signal Output
              </span>
              <span className="font-mono text-[10px] opacity-60 uppercase tracking-tighter">
                TS: {currentSignal.timestamp}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center py-8 relative z-10">
              <div className="text-center">
                <h3 className="text-signal font-bold uppercase italic leading-[0.8] drop-shadow-sm">
                  {currentSignal.type === 'WAIT' ? 'Neutral' : currentSignal.type}
                  <br />
                  {currentSignal.type !== 'WAIT' && 'Signal'}
                </h3>
              </div>
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase opacity-60 mb-1">Execution Price</span>
                <span className="text-3xl font-bold tracking-tighter font-mono">
                  ${currentSignal.priceAtSignal.toFixed(2)}
                </span>
              </div>
              <div className="max-w-[40%] text-right">
                <p className="text-[10px] leading-tight font-bold uppercase italic opacity-80">
                  {currentSignal.reasoning}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brutal-gray border border-white/10 p-6 flex flex-col justify-between h-32">
          <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest block mb-2">History Log</span>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {history.length === 0 ? (
              <span className="text-[10px] font-mono opacity-20 italic">No entry logs found...</span>
            ) : (
              history.slice(0, 5).map(sig => (
                <div key={sig.id} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                  <span className={cn(
                    "text-[8px] font-bold uppercase px-1",
                    sig.type === 'BUY' ? "text-neon-green" : sig.type === 'SELL' ? "text-rose-500" : "text-white"
                  )}>{sig.type}</span>
                  <span className="text-[8px] font-mono opacity-40 italic">{sig.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-neon-green p-6 flex flex-col justify-between h-32 text-black">
          <span className="text-[10px] uppercase font-bold tracking-widest block opacity-60">Risk Management</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold tracking-tighter italic">ACTIVE</span>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase mb-1">Leverage</p>
              <p className="text-xl font-bold font-mono">10.0X</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
