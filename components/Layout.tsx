
import React, { useState, useEffect, useRef } from 'react';
import { ModalType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Starfield: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        
        const stars = Array.from({ length: 500 }, () => {
            const z = Math.random() * 3; // depth
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 / (z + 1), // smaller for distant stars
                speed: (Math.random() * 0.4 + 0.1) / (z + 1), // Slower for distant stars
                opacity: (Math.random() * 0.5 + 0.5) / (z + 1), // Fainter for distant stars
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`, // Varying whiteness
            };
        });
        
        let animationFrameId: number;
        
        const animate = () => {
            stars.forEach(star => {
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity;
                ctx.fill();
            });
            ctx.globalAlpha = 1; // Reset global alpha

            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-[#0a0f2c] to-gray-900" />;
};


const Modal: React.FC<{ title: string; content: React.ReactNode; onClose: () => void }> = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="text-gray-300 space-y-4">{content}</div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const getModalContent = (modal: ModalType) => {
    switch (modal) {
      case 'about':
        return { title: 'About Us', content: <p>This application is a high-fidelity placeholder UI designed to demonstrate the user flow for a Voter Registration Status Checker. It does not connect to any real databases or store personal information. Its purpose is purely for design and user experience demonstration.</p> };
      case 'contact':
        return { title: 'Contact Information', content: <p>For inquiries, please contact us at <a href="mailto:hsini.web@gmail.com" className="text-blue-400 hover:underline">hsini.web@gmail.com</a> or visit our website at <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">doodax.com</a>.</p> };
      case 'guide':
        return { title: 'User Guide', content: <p>To use this tool, please fill in all the fields in the form with accurate information as you would on an official state website. Click the 'Check Registration Status' button to see a simulated result. This will provide you with instructional text on how to proceed to an official website for verification.</p> };
      case 'privacy':
        return { title: 'Privacy Policy', content: <p>We respect your privacy. This is a placeholder application and we do not collect, store, or transmit any personal data entered into the form. All information is handled client-side and is discarded upon leaving or refreshing the page.</p> };
      case 'terms':
        return { title: 'Terms of Service', content: <p>By using this application, you acknowledge that it is a non-functional placeholder and not an official government service. You agree not to enter sensitive real information and understand that the results are simulated for demonstrative purposes only.</p> };
      case 'dmca':
        return { title: 'DMCA Policy', content: <p>All content on this website is original or used for demonstrative purposes. If you believe any content infringes on your copyright, please contact us at <a href="mailto:hsini.web@gmail.com" className="text-blue-400 hover:underline">hsini.web@gmail.com</a> with the necessary information for a takedown request.</p> };
      default:
        return { title: '', content: '' };
    }
  };

  const navLinks: { label: string; modal: ModalType }[] = [
    { label: 'About', modal: 'about' },
    { label: 'Contact', modal: 'contact' },
    { label: 'Guide', modal: 'guide' },
    { label: 'Privacy Policy', modal: 'privacy' },
    { label: 'Terms of Service', modal: 'terms' },
    { label: 'DMCA', modal: 'dmca' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Starfield />
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-3 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          {navLinks.map((link) => (
             <button key={link.modal} onClick={() => setActiveModal(link.modal)} className="text-sm font-medium text-gray-300 hover:text-brand-gold transition-colors">
              {link.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900/50 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="mb-2">
            <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-bold hover:underline">Powered by HSINI MOHAMED</a>
          </p>
          <p>
            <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">doodax.com</a>
            <span className="mx-2">|</span>
            <a href="mailto:hsini.web@gmail.com" className="hover:text-white transition-colors">hsini.web@gmail.com</a>
          </p>
        </div>
      </footer>

      {activeModal && (
        <Modal
          title={getModalContent(activeModal).title}
          content={getModalContent(activeModal).content}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default Layout;