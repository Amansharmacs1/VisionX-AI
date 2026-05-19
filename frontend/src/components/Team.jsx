import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import TiltCard from './TiltCard';

const GithubIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/-2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Team = () => {
  const members = [
    { name: 'Aman', role: 'Developer', github: 'Amansharmacs1' },
    { name: 'Aman Sharma', role: 'Developer', github: 'Amansharma-amn' },
    { name: 'Anumati Sharma', role: 'Developer', github: 'AnumatiSharma' },
    { name: 'Anurag Sharma', role: 'Developer', github: 'Anuragg303' },
  ];

  return (
    <section id="team" className="py-32 relative bg-apple-bg border-t border-overlay-2 perspective-1000">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-apple-text-primary tracking-tight">Meet The <span className="text-apple-text-secondary">Innovators.</span></h2>
          <p className="text-apple-text-secondary text-lg font-light max-w-2xl mx-auto">The visionary minds engineering the future of assistive wearable technology.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {members.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <TiltCard className="h-full">
                <div className="h-full glass-panel p-8 rounded-3xl text-center group hover:bg-overlay-4 transition-colors duration-500">
                  <div className="w-24 h-24 rounded-full mx-auto bg-apple-surface mb-6 flex items-center justify-center border border-overlay-5 group-hover:border-apple-accent/30 group-hover:shadow-[0_0_20px_rgba(0,113,227,0.1)] dark:group-hover:shadow-[0_0_20px_rgba(154,215,255,0.1)] transition-all shadow-inner">
                    <span className="text-2xl font-light text-apple-text-secondary group-hover:text-apple-accent transition-colors">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-apple-text-primary mb-1 tracking-wide">{member.name}</h3>
                  <p className="text-xs font-semibold text-apple-text-secondary tracking-widest mb-6 uppercase">{member.role}</p>
                  
                  <div className="flex justify-center gap-4">
                    <a 
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-apple-surface border border-overlay-5 flex items-center justify-center hover:bg-overlay-8 hover:text-apple-text-primary cursor-pointer transition-colors text-apple-text-secondary shadow-md"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <div className="w-10 h-10 rounded-full bg-apple-surface border border-overlay-5 flex items-center justify-center hover:bg-overlay-8 hover:text-apple-text-primary cursor-pointer transition-colors text-apple-text-secondary shadow-md">
                      <Briefcase className="w-4 h-4" />
                    </div>
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

export default Team;
