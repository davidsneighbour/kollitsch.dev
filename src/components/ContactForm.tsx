import type React from 'react';
import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // This is a placeholder for actual form submission logic
      // In a real implementation, you'd send this data to your backend
      console.log('Form submitted:', formData);

      // Simulate successful submission
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        error: true,
        message: 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
      {formStatus.submitted ? (
        <div className={`p-4 mb-6 rounded-lg ${formStatus.error ? 'bg-error-100 text-error-800' : 'bg-success-100 text-success-800'}`}>
          <p className="font-medium">{formStatus.message}</p>
          {!formStatus.error && (
            <button
              type="button"
              onClick={() => setFormStatus({submitted: false, error: false, message: ''})}
              className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
            >
              Send another message
            </button>
          )}
        </div>
      ) : null}

      {!formStatus.submitted || formStatus.error ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-4"
          >
            Send Message
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default ContactForm;
