import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import TiltCard from './TiltCard';

const USP = () => {
  const usps = [
    'Lightweight & Ergonomic Design',
    'Hands-Free Gesture Interaction',
    'Real-Time Processing at the Edge',
    'Intuitive Spatial Audio Guidance',
    'Low-Latency Face Recognition',
    'Accessible & Human-Centered',
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-apple-surface border-t border-overlay-2 perspective-1000">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-apple-accent/5 -z-10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-apple-accent mb-8 shadow-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-apple-text-primary tracking-tight mb-6">
            The VisionX <span className="text-apple-text-secondary">Advantage.</span>
          </h2>
          <p className="text-apple-text-secondary text-lg font-light leading-relaxed">
            Built from the ground up to redefine assistive wearables. We prioritize comfort, speed, and discretion without compromising on power.
          </p>
        </motion.div>

        <TiltCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-left glass-panel p-10 md:p-14 rounded-[2.5rem]">
            {usps.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 py-4 border-b border-overlay-5"
              >
                <div className="w-6 h-6 rounded-full bg-overlay-5 flex items-center justify-center text-apple-accent shrink-0 shadow-inner">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-apple-text-primary font-medium tracking-wide">{point}</span>
              </motion.div>
            ))}
          </div>
        </TiltCard>
      </div>
    </section>
  );
};

export default USP;
