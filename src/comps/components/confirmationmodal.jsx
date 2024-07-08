// src/components/ConfirmationModal.js

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { BsGoogle } from 'react-icons/bs';
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const authInfo = {
        userID: result.user.uid,
        name: result.user.displayName,
        profilePhoto: result.user.photoURL,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));
      navigate("/");
      window.location.reload(); 
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg flex flex-col items-center">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-center items-center">
          <button
            onClick={signInWithGoogle}
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
