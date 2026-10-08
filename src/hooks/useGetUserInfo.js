import { useAuth } from './useAuth';

export const useGetUserInfo = () => {
  const { user } = useAuth();
  const metadata = user?.user_metadata ?? {};

  return {
    userID: user?.id ?? null,
    name: metadata.full_name ?? metadata.name ?? user?.email ?? null,
    profilePhoto: metadata.avatar_url ?? metadata.picture ?? null,
    isAuth: Boolean(user),
  };
};
