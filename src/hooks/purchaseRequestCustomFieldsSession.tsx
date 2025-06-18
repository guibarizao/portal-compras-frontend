import { createContext, ReactNode, useContext } from "react";

import IPurchaseRequestCustomField from "../interfaces/IPurchaseRequestCustomField";
import { useSessionStorage } from "../services/useSessionStorage";

type PropsPurchaseRequestCustomFieldContext = {
  getPurchaseRequestCustomFieldsSession: () => IPurchaseRequestCustomField[];
  updatePurchaseRequestCustomFieldsSession: (
    purchaseRequestCustomFields: IPurchaseRequestCustomField[]
  ) => void;
};

const PurchaseRequestCustomFieldContext =
  createContext<PropsPurchaseRequestCustomFieldContext>(
    {} as PropsPurchaseRequestCustomFieldContext
  );

const PurchaseRequestCustomFieldContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const sessionStorage = useSessionStorage();

  const getPurchaseRequestCustomFieldsSession = () => {
    const purchaseRequestCustomFieldsString = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestCustomFields"
    );

    return purchaseRequestCustomFieldsString;
  };

  const updatePurchaseRequestCustomFieldsSession = (
    purchaseRequestCustomFields: IPurchaseRequestCustomField[]
  ) => {
    sessionStorage.setItem(
      "@PORTAL-COMPRAS:purchaseRequestCustomFields",
      purchaseRequestCustomFields
    );
  };

  return (
    <PurchaseRequestCustomFieldContext.Provider
      value={{
        getPurchaseRequestCustomFieldsSession,
        updatePurchaseRequestCustomFieldsSession,
      }}
    >
      {children}
    </PurchaseRequestCustomFieldContext.Provider>
  );
};

function usePurchaseRequestCustomFields(): PropsPurchaseRequestCustomFieldContext {
  const context = useContext(PurchaseRequestCustomFieldContext);

  if (!context) {
    throw new Error(
      "usePurchaseRequestCustomFields deve ser usado dentro de um PurchaseRequestCustomFieldContextProvider"
    );
  }

  return context;
}

export {
  PurchaseRequestCustomFieldContextProvider,
  usePurchaseRequestCustomFields,
};
