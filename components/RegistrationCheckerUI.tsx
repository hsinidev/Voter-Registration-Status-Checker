
import React, { useState, useCallback } from 'react';
import { RegistrationFormData, FormErrors } from '../types';
import { validateForm } from '../lib/formValidation';
import { US_STATES } from '../constants';

const RegistrationCheckerUI: React.FC = () => {
  const initialFormState: RegistrationFormData = {
    firstName: '',
    lastName: '',
    dob: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  };
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        // Scroll to the result for better UX on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  };
  
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
  };

  const FormInput: React.FC<{ name: keyof RegistrationFormData, label: string, type?: string, error?: string, autoComplete?: string }> = ({ name, label, type = "text", error, autoComplete }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 text-left">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        autoComplete={autoComplete}
        className={`mt-1 block w-full bg-gray-700/50 border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-600'} rounded-lg shadow-sm py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
      />
      {error && <p className="mt-1 text-xs text-red-400 text-left">{error}</p>}
    </div>
  );
  
  const FormSelect: React.FC<{ name: 'state', label: string, error?: string }> = ({ name, label, error }) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 text-left">{label}</label>
        <select
          id={name}
          name={name}
          value={formData.state}
          onChange={handleChange}
          className={`mt-1 block w-full bg-gray-700/50 border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-600'} rounded-lg shadow-sm py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
        >
          <option value="">Select a State</option>
          {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
        </select>
        {error && <p className="mt-1 text-xs text-red-400 text-left">{error}</p>}
      </div>
  );

  if (isSubmitted) {
    return (
        <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-lg shadow-2xl p-6 md:p-10 text-center border border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-white">Status Check Complete</h2>
            <p className="mt-4 text-gray-300">
                Due to security and privacy laws, we cannot display your registration status directly. Please click the link below to verify your status on the official {formData.state} state website.
            </p>
            <a 
                href={`https://www.google.com/search?q=official+voter+registration+lookup+${formData.state}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105"
            >
                Go to Official {formData.state} Website
            </a>
            <button
                onClick={handleReset}
                className="mt-6 block w-full md:w-auto md:inline-block md:ml-4 text-sm text-gray-400 hover:text-white transition-colors"
            >
                Check another registration
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-lg shadow-2xl p-6 md:p-10 border border-gray-700 text-left">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">Voter Information</h2>
        <p className="mt-2 text-gray-400">Enter your information exactly as it appears on your voter registration.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          <fieldset className="border-t border-gray-700 pt-6">
            <legend className="text-lg font-semibold text-blue-300 px-2 -ml-2">Personal Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormInput name="firstName" label="First Name" error={errors.firstName} autoComplete="given-name" />
              <FormInput name="lastName" label="Last Name" error={errors.lastName} autoComplete="family-name" />
              <div className="md:col-span-2">
                 <FormInput name="dob" label="Date of Birth" type="date" error={errors.dob} autoComplete="bday" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border-t border-gray-700 pt-6">
            <legend className="text-lg font-semibold text-red-300 px-2 -ml-2">Residential Address</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2">
                    <FormInput name="streetAddress" label="Street Address" error={errors.streetAddress} autoComplete="street-address"/>
                </div>
                <FormInput name="city" label="City" error={errors.city} autoComplete="address-level2" />
                <FormSelect name="state" label="State" error={errors.state} />
                <div className="md:col-span-2">
                    <FormInput name="zipCode" label="Zip Code" error={errors.zipCode} autoComplete="postal-code" />
                </div>
            </div>
          </fieldset>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-brand-blue to-blue-800 hover:from-blue-800 hover:to-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-300 disabled:bg-gray-600 disabled:from-gray-600 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : 'Check Registration Status'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationCheckerUI;