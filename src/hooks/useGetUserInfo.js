// src/hooks/useGetUserInfo.js
export const useGetUserInfo = () => {
  const authData = JSON.parse(localStorage.getItem('auth'));

  const userID = authData ? authData.userID : null;
  const name = authData ? authData.name : null;
  const profilePhoto = authData ? authData.profilePhoto : null;
  const isAuth = authData ? authData.isAuth : false;

  return { userID, name, profilePhoto, isAuth };
};
