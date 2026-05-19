import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import TiltCard from './TiltCard';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-apple-bg perspective-1000">
      {/* Background with animated volumetric mesh */}
      <div className="absolute inset-0 bg-mesh-pattern z-0 opacity-80 pointer-events-none mix-blend-screen"></div>
      
      <motion.div style={{ opacity }} className="container mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Typography */}
        <motion.div 
          style={{ y: y1 }}
          className="lg:w-[55%] flex flex-col items-start gap-8 z-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-overlay-10 bg-overlay-2 backdrop-blur-md text-sm text-apple-text-secondary shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-apple-accent shadow-[0_0_10px_rgba(154,215,255,0.8)]"></span>
            <span className="tracking-wide">VisionOS 2.0 Available</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6rem] font-semibold leading-[1.05] tracking-tighter text-apple-text-primary text-shadow-sm"
          >
            Sight, <br />
            <span className="text-gradient">Redefined.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-apple-text-secondary text-lg sm:text-xl md:text-2xl max-w-xl font-light leading-relaxed tracking-wide"
          >
            An ambient wearable that maps the world around you in real-time. Engineered for absolute independence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-5 mt-4"
          >
            <button className="px-8 py-4 rounded-full bg-apple-text-primary text-apple-bg font-medium flex items-center gap-2 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Explore VisionX
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 rounded-full glass-panel text-apple-text-primary font-medium hover:bg-overlay-5 transition-colors duration-300">
              Watch Film
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side: Cinematic Image with 3D Tilt */}
        <motion.div 
          style={{ y: y2 }}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="lg:w-[45%] relative w-full z-10"
        >
          <TiltCard className="w-full max-w-lg mx-auto lg:ml-auto ambient-glow">
            <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden glass-panel group">
              {/* Volumetric lighting overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-apple-accent/10 via-transparent to-transparent z-10 mix-blend-overlay"></div>
              
              <img 
                src="/Glasses.png" 
                alt="Premium Smart Glasses" 
                className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              
              {/* Floating UI Elements matching Sonic/Lamp depth */}
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="absolute bottom-10 left-8 right-8 z-20 flex justify-between items-end drop-shadow-2xl"
              >
                <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl bg-apple-surface/40">
                   <div className="w-2.5 h-2.5 rounded-full bg-apple-accent shadow-[0_0_10px_rgba(154,215,255,0.8)] animate-pulse"></div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-semibold text-apple-text-secondary tracking-widest uppercase">Status</span>
                     <span className="text-xs font-medium text-apple-text-primary tracking-wide">Spatial Mapping Active</span>
                   </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
