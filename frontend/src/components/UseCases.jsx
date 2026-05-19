import { motion } from 'framer-motion';
import { Home, Building2, Users2, Briefcase, Coffee, Navigation } from 'lucide-react';
import TiltCard from './TiltCard';

const UseCases = () => {
  const cases = [
    { title: 'Indoor Navigation', icon: <Home className="w-6 h-6" /> },
    { title: 'Outdoor Mobility', icon: <Navigation className="w-6 h-6" /> },
    { title: 'Social Context', icon: <Users2 className="w-6 h-6" /> },
    { title: 'Professional Use', icon: <Briefcase className="w-6 h-6" /> },
    { title: 'Daily Tasks', icon: <Coffee className="w-6 h-6" /> },
    { title: 'Campus/Office', icon: <Building2 className="w-6 h-6" /> },
  ];

  return (
    <section className="py-32 relative bg-apple-bg border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-apple-text-primary tracking-tight">
            Designed for <br/><span className="text-apple-text-secondary">Everyday Life.</span>
          </h2>
          <p className="text-apple-text-secondary text-lg font-light max-w-2xl leading-relaxed">
            Whether you are navigating a busy street, finding your desk at the office, or recognizing a friend at a cafe, VisionX adapts to your environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {cases.map((uc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard>
                <div className="p-8 lg:p-12 rounded-[2rem] glass-panel hover:bg-overlay-4 transition-colors duration-500 flex flex-col items-center justify-center text-center gap-6 group">
                  <div className="text-apple-text-secondary group-hover:text-apple-accent group-hover:scale-110 transition-all duration-500">
                    {uc.icon}
                  </div>
                  <h3 className="text-lg font-medium text-apple-text-primary tracking-wide">{uc.title}</h3>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
