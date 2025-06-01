import React from 'react';

const CancellationAndRefund = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Cancellation and Refund Policy</h1>
      <p>If you wish to cancel a service or request a refund, please refer to the following process:</p>
      <h2 className="mt-4 text-2xl font-semibold">Cancellation</h2>
      <p>You can cancel any service within 7 days of purchase.</p>
      <h2 className="mt-4 text-2xl font-semibold">Refunds</h2>
      <p>Refund requests must be made within 7 days from the purchase date.</p>
      <p>
        For further assistance, contact us at
        <a href="mailto:devxoshakya@gmail.com" className="text-blue-600">
          {' '}
          {' '}
          devxoshakya@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default CancellationAndRefund;
