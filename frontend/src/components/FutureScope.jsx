import { motion } from 'framer-motion';
import { Map, Type, Mic, Cloud, Scan, Wifi, AlertTriangle } from 'lucide-react';
import TiltCard from './TiltCard';

const FutureScope = () => {
  const futureItems = [
    { title: 'GPS Navigation', icon: <Map className="w-6 h-6" /> },
    { title: 'OCR Text Reading', icon: <Type className="w-6 h-6" /> },
    { title: 'Voice Assistant', icon: <Mic className="w-6 h-6" /> },
    { title: 'Emergency SOS', icon: <AlertTriangle className="w-6 h-6" /> },
    { title: 'Cloud Processing', icon: <Cloud className="w-6 h-6" /> },
    { title: 'Advanced Detection', icon: <Scan className="w-6 h-6" /> },
    { title: 'IoT Integration', icon: <Wifi className="w-6 h-6" /> },
  ];

  return (
    <section className="py-32 relative bg-apple-surface border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 text-center max-w-5xl">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-semibold mb-16 text-apple-text-primary tracking-tight"
        >
          Beyond <span className="text-apple-text-secondary">Tomorrow.</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6">
          {futureItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard>
                <div className="glass-panel px-8 py-5 rounded-full flex items-center gap-4 hover:bg-overlay-4 transition-all duration-500 group cursor-default">
                  <div className="text-apple-text-secondary group-hover:text-apple-text-primary transition-colors duration-300">
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm text-apple-text-primary tracking-wide">{item.title}</span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FutureScope;
