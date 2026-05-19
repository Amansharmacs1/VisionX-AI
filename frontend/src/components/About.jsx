import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Map, Users } from 'lucide-react';

const About = () => {
  const cards = [
    { title: 'Safety', icon: <ShieldCheck />, desc: 'Real-time hazard detection.' },
    { title: 'Independence', icon: <UserCheck />, desc: 'Empowering daily living.' },
    { title: 'Navigation', icon: <Map />, desc: 'Smart routing and guidance.' },
    { title: 'Connection', icon: <Users />, desc: 'Face recognition for socializing.' },
  ];

  return (
    <section id="about" className="py-32 relative bg-apple-bg border-t border-overlay-5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-apple-text-primary tracking-tight mb-6">
              Empowering Vision <br/><span className="text-apple-text-secondary">Through Intelligence.</span>
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:w-1/2"
          >
            <p className="text-apple-text-secondary text-lg font-light leading-relaxed">
              We aim to solve mobility challenges faced by visually impaired individuals. By providing real-time AI assistance, we enable users to navigate their environment safely, confidently, and independently.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="p-8 rounded-3xl bg-apple-surface border border-overlay-5 hover:border-overlay-10 transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-apple-bg border border-overlay-5 flex items-center justify-center mb-6 text-apple-text-secondary group-hover:text-apple-text-primary transition-colors duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-medium text-apple-text-primary mb-2">{card.title}</h3>
              <p className="text-apple-text-secondary font-light text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
