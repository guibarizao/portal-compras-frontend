import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import IUserToken from "../interfaces/IUserToken";

import { useSessionStorage } from "../services/useSessionStorage";
import { useLoginService } from "../services/useLoginService";
import IHeadOffice from "../interfaces/IHeadOffice";

type PropsUserContext = {
  state: IUserToken;
  setState: React.Dispatch<React.SetStateAction<IUserToken>>;
  signIn(username: string, password: string): Promise<void>;
  signOut(): void;
  currentHeadOffice: IHeadOffice | null;
  changeCurrentHeadOffice(headOfficeId: string): void;
};

const UserContext = createContext<PropsUserContext>({} as PropsUserContext);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const sessionStorage = useSessionStorage();
  const userLoginService = useLoginService();
  const user = sessionStorage.getItem("@PORTAL-COMPRAS:user");
  const {
    expires_in,
    username,
    access_token,
    refresh_token,
    name,
    email,
    tenantDomain,
    logged,
    typeAuth,
    costCenter,
    wallet,
    branchOffice,
    resources,
    erpUrl,
    headOffices,
  } = user || {
    expires_in: 0,
    username: "",
    access_token: "",
    refresh_token: "",
    name: "",
    email: "",
    tenantDomain: "",
    logged: false,
    typeAuth: "",
    costCenter: null,
    wallet: null,
    resources: [],
    erpUrl: "",
    headOffices: [],
  };

  const [state, setState] = useState({
    expires_in,
    username,
    access_token,
    refresh_token,
    name,
    email,
    tenantDomain,
    logged,
    typeAuth,
    costCenter,
    wallet,
    branchOffice,
    resources,
    erpUrl,
    headOffices,
  });

  const [currentHeadOffice, setCurrentHeadOffice] =
    useState<IHeadOffice | null>(() => {
      return sessionStorage.getItem("@PORTAL-COMPRAS:currentHeadOffice")
        ? sessionStorage.getItem("@PORTAL-COMPRAS:currentHeadOffice")
        : null;
    });

  const signIn = async (username: string, password: string) => {
    const user = await userLoginService.login(username, password);
    user.logged = true;
    setState(user);
    sessionStorage.setItem("@PORTAL-COMPRAS:user", user);

    if (!currentHeadOffice && !!user.headOffices) {
      setCurrentHeadOffice(user.headOffices[0]);

      sessionStorage.setItem(
        "@PORTAL-COMPRAS:currentHeadOffice",
        user.headOffices[0]
      );
    }

    window.location.reload();
  };

  const signOut = async () => {
    sessionStorage.clear();
    setState({
      expires_in: 0,
      username: "",
      access_token: "",
      refresh_token: "",
      name: "",
      email: "",
      tenantDomain: "",
      logged: false,
      typeAuth: "",
      costCenter: null,
      wallet: null,
      branchOffice: null,
      resources: [],
      erpUrl: "",
      headOffices: [],
    });

    setCurrentHeadOffice(null);
  };

  const changeCurrentHeadOffice = useCallback(async (headOfficeId: string) => {
    const user: IUserToken = sessionStorage.getItem("@PORTAL-COMPRAS:user");

    if (user.headOffices) {
      const headOffice = user.headOffices.filter(
        (headOffice) => headOffice.id === headOfficeId
      )[0];
      setCurrentHeadOffice(headOffice);

      sessionStorage.setItem("@PORTAL-COMPRAS:currentHeadOffice", headOffice);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        state,
        setState,
        signIn,
        signOut,
        currentHeadOffice,
        changeCurrentHeadOffice,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

function useAuth(): PropsUserContext {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export { UserContextProvider, useAuth };
