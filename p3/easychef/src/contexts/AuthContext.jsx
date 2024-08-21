import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [bearerToken, setBearerToken] = useState(() => 
    localStorage.getItem("bearerToken")
    );
    
    const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
    );
    
    useEffect(() => {
        localStorage.setItem("bearerToken", bearerToken);
    }, [bearerToken]);
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => 
        (bearerToken && refreshToken)
    );

    useEffect(() => {
    localStorage.setItem("refreshToken", refreshToken);
    }, [refreshToken]);

    return (
        <AuthContext.Provider
          value={{ bearerToken, setBearerToken, refreshToken, setRefreshToken, isAuthenticated, setIsAuthenticated }}
        >
          {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;