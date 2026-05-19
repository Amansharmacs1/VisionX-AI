import { motion } from 'framer-motion';
import { ScanFace, Car, Volume2, Hand, Cpu, Compass } from 'lucide-react';
import TiltCard from './TiltCard';

const Features = () => {
  const showcaseFeature = { 
    title: 'Facial Recognition', 
    desc: 'Instantly recognize friends, family, and colleagues. The device quietly whispers the names of known individuals as they approach, fostering deeper social connections.',
    image: '/output.png',
    icon: <ScanFace className="w-6 h-6" />
  };

  const gridFeatures = [
    { title: 'Real-Time Object Detection', icon: <Car />, desc: 'Seamlessly identify dynamic and static obstacles in your path.' },
    { title: 'Intuitive Audio Navigation', icon: <Volume2 />, desc: 'Experience bone-conduction audio that guides you without blocking out the world.' },
    { title: 'Gesture Control', icon: <Hand />, desc: 'Hands-free interaction using intuitive hand gestures.' },
    { title: 'Edge Processing', icon: <Cpu />, desc: 'Processes visual data instantly on-device without lag.' },
    { title: 'Smart Direction', icon: <Compass />, desc: 'Identifies left, right, straight directions intelligently.' },
  ];

  return (
    <section id="features" className="py-32 relative bg-apple-bg overflow-hidden perspective-1000">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-semibold mb-6 text-apple-text-primary tracking-tight"
          >
            Intelligence <br/><span className="text-apple-text-secondary">built-in.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-apple-text-secondary max-w-2xl mx-auto text-xl font-light"
          >
            Every feature is meticulously designed to provide a seamless, non-intrusive extension of your senses.
          </motion.p>
        </div>

        {/* Primary Showcase Feature */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 flex flex-col items-start"
          >
            <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-apple-text-primary mb-8 shadow-xl">
              {showcaseFeature.icon}
            </div>
            <h3 className="text-3xl md:text-4xl font-medium mb-6 text-apple-text-primary leading-tight tracking-tight">{showcaseFeature.title}</h3>
            <p className="text-apple-text-secondary text-lg font-light leading-relaxed mb-8">{showcaseFeature.desc}</p>
            <button className="text-apple-text-primary border-b border-overlay-20 pb-1 hover:border-overlay-50 transition-colors duration-300 flex items-center gap-2 text-sm uppercase tracking-widest font-medium">
              Learn More
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 w-full"
          >
            <TiltCard className="ambient-glow relative w-full aspect-[4/3]">
              <div className="absolute inset-0 bg-apple-surface/20 z-10 mix-blend-overlay"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden glass-panel group">
                <img 
                  src={showcaseFeature.image} 
                  alt={showcaseFeature.title} 
                  className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-1000 ease-out" 
                />
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Other Features Grid */}
        <div className="border-t border-overlay-5 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 rounded-3xl glass-panel hover:bg-overlay-4 transition-colors duration-500 group"
              >
                <div className="text-apple-text-secondary mb-6 group-hover:text-apple-text-primary transition-colors">{feat.icon}</div>
                <h4 className="text-xl font-medium text-apple-text-primary mb-3 tracking-wide">{feat.title}</h4>
                <p className="text-apple-text-secondary font-light leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
