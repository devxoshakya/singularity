import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p>
        At MIET Results, we are committed to protecting your privacy. This privacy policy outlines how we collect, use, and protect your personal data.
      </p>
      <h2 className="mt-4 text-2xl font-semibold">Information We Collect</h2>
      <ul className="ml-5 list-disc">
        <li>Personal identification information (such as name, email address)</li>
        <li>Log data (IP address, browser type, etc.)</li>
      </ul>
      <h2 className="mt-4 text-2xl font-semibold">How We Use Your Information</h2>
      <ul className="ml-5 list-disc">
        <li>To provide you with results and services</li>
        <li>To improve our website and services</li>
      </ul>
      <h2 className="mt-4 text-2xl font-semibold">Data Protection</h2>
      <p>
        We use encryption and other security measures to protect your data. If you have any questions, please contact us at
        {' '}
        <a href="mailto:devxoshakya@gmail.com" className="text-blue-600">devxoshakya@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
