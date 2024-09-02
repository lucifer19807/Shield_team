import React from 'react';

const Modal = ({ isOpen, onClose, userData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Patient Details</h2>
        <p><strong>Name:</strong> {userData.FirstName} {userData.LastName}</p>
        <p><strong>Phone:</strong> {userData.ph}</p>
        <p><strong>Admit Date:</strong> {userData.admitDate ? new Date(userData.admitDate.seconds * 1000).toLocaleDateString() : 'Not Admitted'}</p>
        <p><strong>Discharge Date:</strong> {userData.dischargeDate ? new Date(userData.dischargeDate.seconds * 1000).toLocaleDateString() : 'Not Discharged'}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
