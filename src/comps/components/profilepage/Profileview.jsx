
import { Link } from 'react-router-dom';


import { useGetUserInfo } from '../../../hooks/useGetUserInfo';

const ProfileView = () => {
  const { name, profilePhoto } = useGetUserInfo();

  return (
    <div className="flex flex-col items-center h-96 mt-20">
    <h2>{name}</h2>
    <img src={profilePhoto} alt="" className="h-10 w-10 object-cover rounded-full" />

    <Link to="/Transactionhistory">
        <button className='flex p-4 mt-3 rounded-md bg-slate-500 h-9 items-center justify-center font-bold'>
          Transaction Record
        </button>
      </Link>

    </div>
  );
};

export default ProfileView;
