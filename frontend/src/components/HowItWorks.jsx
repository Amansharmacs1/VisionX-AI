import { motion } from 'framer-motion';
import { Camera, Cpu, ScanFace, Volume2 } from 'lucide-react';
import TiltCard from './TiltCard';

const HowItWorks = () => {
  const steps = [
    { title: 'Capture', desc: 'Continuous environmental mapping.', icon: <Camera className="w-5 h-5" /> },
    { title: 'Process', desc: 'Instantaneous on-device AI analysis.', icon: <Cpu className="w-5 h-5" /> },
    { title: 'Identify', desc: 'Object and facial recognition.', icon: <ScanFace className="w-5 h-5" /> },
    { title: 'Guide', desc: 'Intuitive spatial audio feedback.', icon: <Volume2 className="w-5 h-5" /> },
  ];

  return (
    <section id="workflow" className="py-32 relative bg-apple-bg border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-20 items-center">
        
        {/* Left Side: Image */}
        <motion.div 
          initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 w-full"
        >
          <TiltCard className="ambient-glow w-full aspect-square">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden glass-panel group">
              <img 
                src="/flow diagram.png" 
                alt="Visually impaired person navigating" 
                className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-1000 ease-out mix-blend-luminosity opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-apple-surface/80 via-transparent to-transparent mix-blend-overlay"></div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Right Side: Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 flex flex-col items-start"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-apple-text-primary tracking-tight">Seamless <br/><span className="text-apple-text-secondary">Integration.</span></h2>
          <p className="text-apple-text-secondary mb-16 text-lg font-light leading-relaxed max-w-md">
            The VisionX workflow operates entirely in the background, analyzing the world in milliseconds and delivering non-intrusive guidance exactly when needed.
          </p>

          <div className="flex flex-col gap-10 relative w-full">
            {/* Connecting line */}
            <div className="absolute left-7 top-4 bottom-4 w-px bg-gradient-to-b from-apple-accent/50 via-overlay-10 to-transparent z-0"></div>

            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-8 relative z-10 group glass-panel p-4 rounded-2xl w-full max-w-md hover:bg-overlay-2 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-apple-surface border border-overlay-10 flex items-center justify-center shrink-0 text-apple-accent shadow-md group-hover:scale-105 transition-transform duration-500">
                  {step.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium text-apple-text-primary mb-1 tracking-wide">{step.title}</h3>
                  <p className="text-apple-text-secondary text-sm font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
