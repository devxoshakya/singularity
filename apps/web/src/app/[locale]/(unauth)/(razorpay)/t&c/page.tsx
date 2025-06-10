import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Terms and Conditions</h1>
      <p>
        By using MIET Results, you agree to comply with the following terms and conditions.
      </p>
      <h2 className="mt-4 text-2xl font-semibold">Usage Rights</h2>
      <p>You may only use the website for personal, non-commercial purposes.</p>
      <h2 className="mt-4 text-2xl font-semibold">User Responsibility</h2>
      <p>You are responsible for the accuracy of the data you provide.</p>
      <h2 className="mt-4 text-2xl font-semibold">Limitation of Liability</h2>
      <p>
        We are not liable for any errors in the results or data. For any queries, contact
        <a href="mailto:devxoshakya@gmail.com" className="text-blue-600">devxoshakya@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default TermsAndConditions;
