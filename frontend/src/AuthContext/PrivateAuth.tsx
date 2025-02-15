import { useContext } from 'react';
import { AuthContext } from './AuthContextProvider';
import { useNavigate } from 'react-router-dom';

export default function PrivateAuth({ children }: any) {
  const value = useContext(AuthContext) as {
    Name: string;
    isLoggedAdmin: boolean;
  };
  const navigate = useNavigate();
  console.log(value);
  if (value.isLoggedAdmin == true) {
    console.log('navigate');
    navigate('/dashboard');
    return;
  }
  return <>{children}</>;
}
