import { motion } from 'framer-motion';
import { Hand, Pointer, MousePointer2 } from 'lucide-react';
import TiltCard from './TiltCard';

const GestureControl = () => {
  const gestures = [
    { icon: <Hand className="w-8 h-8" />, name: 'Fist', action: 'Toggle Sound', description: 'Quickly mute or unmute audio feedback.' },
    { icon: <Pointer className="w-8 h-8 transform rotate-180" />, name: 'Two Fingers', action: 'Change Mode', description: 'Switch between navigation and recognition mode.' },
    { icon: <MousePointer2 className="w-8 h-8" />, name: 'Index Hold', action: 'Tell Time', description: 'Get the current time instantly.' },
  ];

  return (
    <section className="py-32 relative bg-apple-surface border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[40%]"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-apple-text-primary tracking-tight">Intuitive <br /><span className="text-apple-text-secondary">Control.</span></h2>
            <p className="text-apple-text-secondary leading-relaxed text-lg font-light mb-8">
              Interact with your smart glasses naturally. Our advanced gesture recognition system translates simple hand movements into powerful commands, eliminating the need for buttons or external controllers.
            </p>
          </motion.div>

          <div className="lg:w-[60%] flex flex-col sm:flex-row gap-6 w-full">
            {gestures.map((gesture, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 w-full"
              >
                <TiltCard className="h-full">
                  <div className="h-full glass-panel p-8 rounded-[2rem] hover:bg-overlay-4 transition-all duration-500 group flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-apple-bg border border-overlay-5 flex items-center justify-center mb-8 text-apple-text-secondary group-hover:text-apple-accent group-hover:scale-110 transition-all duration-500 shadow-inner">
                        {gesture.icon}
                      </div>
                      
                      <h3 className="text-xl font-medium mb-2 text-apple-text-primary tracking-tight">{gesture.name}</h3>
                      <div className="text-apple-accent text-[10px] font-semibold tracking-widest uppercase mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                        {gesture.action}
                      </div>
                    </div>
                    <p className="text-sm font-light text-apple-text-secondary leading-relaxed">{gesture.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GestureControl;
