import { Code, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-apple-bg pt-20 pb-10 border-t border-overlay-2 relative overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-apple-text-primary flex items-center justify-center shadow-md">
                <span className="font-bold text-apple-bg text-[10px] tracking-tighter">AI</span>
              </div>
              <span className="text-lg font-medium tracking-wide text-apple-text-primary">Vision<span className="text-apple-text-secondary">X</span></span>
            </div>
            <p className="text-sm text-apple-text-secondary font-light text-center md:text-left max-w-xs leading-relaxed">
              Engineering independence through advanced wearable intelligence.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-apple-text-secondary hover:text-apple-text-primary transition-colors duration-300">
              <Code className="w-5 h-5" />
            </a>
            <a href="#" className="text-apple-text-secondary hover:text-apple-text-primary transition-colors duration-300">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="text-apple-text-secondary hover:text-apple-text-primary transition-colors duration-300">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-overlay-5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-apple-text-secondary font-light tracking-wide">
          <p>&copy; {new Date().getFullYear()} VisionX. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-apple-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-apple-text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
