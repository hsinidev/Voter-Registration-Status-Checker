
import React from 'react';
import Layout from './components/Layout';
import RegistrationCheckerUI from './components/RegistrationCheckerUI';
import SeoArticle from './components/SeoArticle';

const App: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                Check Your Voter Registration Status
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                A secure, friendly, and modern placeholder to simulate checking your voter status. Your privacy is paramount—no data is stored.
            </p>
        </div>
        
        {/* Main Checker Component */}
        <RegistrationCheckerUI />
        
        {/* SEO Article Section */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto text-left">
          <SeoArticle />
        </div>
      </div>
    </Layout>
  );
};

export default App;