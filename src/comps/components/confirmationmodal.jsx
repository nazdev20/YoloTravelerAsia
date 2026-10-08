// src/components/ConfirmationModal.js

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BsGoogle } from 'react-icons/bs';
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const { signInWithGoogle: startGoogleSignIn } = useAuth();
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      if (onConfirm) await onConfirm();
      else await startGoogleSignIn();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg flex flex-col items-center">
        <p className="text-lg mb-4">{message}</p>
        {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
        <div className="flex justify-center items-center">
          <button
            onClick={handleSignIn}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
          >
         <  BsGoogle />  Sign in with Google
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
