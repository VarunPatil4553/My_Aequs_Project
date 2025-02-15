import { createContext, useState } from 'react';

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }: any) {
  const [isLoggedAdmin, setIsLoggedAdmin] = useState<boolean>(true);
  const [employeeLogged, setEmployeeLogged] = useState(() => {
    return localStorage.getItem('employee') || ''; // Default to empty string if not found
  });
  console.log(employeeLogged);
  const value = {
    Name: 'xzy',
    isLoggedAdmin,
    setIsLoggedAdmin,
    employeeLogged,
    setEmployeeLogged,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
