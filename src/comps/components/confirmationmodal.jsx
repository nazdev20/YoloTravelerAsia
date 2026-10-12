import { useNavigate } from 'react-router-dom';

const ConfirmationModal = ({ message, onCancel }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg flex flex-col items-center">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-center items-center">
          <button onClick={() => navigate('/auth')} className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2 rounded-md mr-2">Continue to sign in</button>
          <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
