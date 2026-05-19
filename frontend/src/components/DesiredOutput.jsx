import { motion } from 'framer-motion';
import { Terminal, Volume2 } from 'lucide-react';
import TiltCard from './TiltCard';

const DesiredOutput = () => {
  const outputs = [
    { type: 'Face Recognition', msg: 'Aman is on your left', color: 'text-apple-accent' },
    { type: 'Obstacle Detection', msg: 'Obstacle nearby', color: 'text-red-500' },
    { type: 'Time Assistant', msg: 'The time is 4:30 PM', color: 'text-apple-text-primary' },
    { type: 'System', msg: 'Mode changed to Output', color: 'text-apple-text-secondary' },
  ];

  return (
    <section className="py-32 relative bg-apple-bg border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-apple-text-primary tracking-tight">Real-Time <br/><span className="text-apple-text-secondary">Audio Output.</span></h2>
            <p className="text-apple-text-secondary mb-10 text-lg font-light leading-relaxed max-w-md">
              Experience seamless environmental awareness through instant audio cues. The system processes visual data and translates it into clear, concise spoken information.
            </p>
            <div className="glass-panel px-6 py-3 rounded-full inline-flex items-center gap-4 text-apple-accent">
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span className="font-medium text-sm tracking-wide uppercase">Simulated Audio Engine</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:w-1/2 w-full relative z-10"
          >
            <TiltCard className="ambient-glow w-full">
              <div className="w-full glass-panel rounded-3xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-overlay-5 to-transparent pointer-events-none"></div>
                
                {/* Terminal Header */}
                <div className="bg-apple-surface/40 px-6 py-4 border-b border-overlay-5 flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-apple-text-secondary" />
                    <span className="text-xs text-apple-text-secondary font-mono tracking-widest uppercase">system_output.log</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-overlay-20 hover:bg-red-400 transition-colors"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-overlay-20 hover:bg-yellow-400 transition-colors"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-overlay-20 hover:bg-green-400 transition-colors"></div>
                  </div>
                </div>
                
                {/* Terminal Body */}
                <div className="p-8 font-mono text-sm flex flex-col gap-5 h-80 overflow-y-auto">
                  {outputs.map((out, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col sm:flex-row sm:gap-6 gap-1"
                    >
                      <span className="text-apple-text-secondary/50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <div className="flex flex-col">
                        <span className="text-apple-text-secondary text-[10px] uppercase tracking-widest mb-1">{out.type}</span>
                        <span className={`${out.color} font-medium tracking-wide`}>&gt; {out.msg}</span>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-4 bg-apple-accent mt-2"
                  ></motion.div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DesiredOutput;
