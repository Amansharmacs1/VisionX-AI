import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const TechStack = () => {
  const stack = [
    {
      category: 'Frontend',
      color: 'from-blue-500 to-cyan-400',
      items: ['React', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      category: 'AI & Backend',
      color: 'from-green-500 to-emerald-400',
      items: ['Python', 'OpenCV', 'MediaPipe', 'face_recognition', 'NumPy'],
    },
    {
      category: 'Hardware',
      color: 'from-purple-500 to-pink-500',
      items: ['Raspberry Pi', 'HD Camera', 'Earphones', 'Smart Glasses Frame'],
    }
  ];

  return (
    <section className="py-24 relative bg-apple-bg border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-semibold mb-16 text-apple-text-primary tracking-tight"
        >
          Powered by <span className="text-apple-text-secondary">Advanced Tech</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stack.map((group, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="h-full">
                <div className="glass-panel p-8 rounded-3xl h-full flex flex-col group hover:bg-overlay-2 transition-colors duration-500">
                  <h3 className={`text-2xl font-semibold mb-8 bg-clip-text text-transparent bg-gradient-to-r ${group.color}`}>
                    {group.category}
                  </h3>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    {group.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx}
                        className="py-3 px-4 rounded-xl bg-apple-surface hover:bg-overlay-4 transition-colors border border-overlay-5 flex items-center justify-between group/item cursor-default shadow-sm"
                      >
                        <span className="font-medium text-sm text-apple-text-secondary group-hover/item:text-apple-text-primary transition-colors tracking-wide">{item}</span>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${group.color} opacity-50 group-hover/item:opacity-100 transition-opacity`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
