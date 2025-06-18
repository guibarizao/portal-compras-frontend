import React, { HtmlHTMLAttributes } from "react";

import { UserContextProvider } from "./auth";
import { PurchaseRequestCustomFieldContextProvider } from "./purchaseRequestCustomFieldsSession";
import { CustomFieldListOptionsContextProvider } from "./customFieldsListOptions";

interface IAppProvider extends HtmlHTMLAttributes<HTMLElement> {}

const AppProvider: React.FC<IAppProvider> = ({ children }) => {
  return (
    <UserContextProvider>
      <PurchaseRequestCustomFieldContextProvider>
        <CustomFieldListOptionsContextProvider>
          {children}
        </CustomFieldListOptionsContextProvider>
      </PurchaseRequestCustomFieldContextProvider>
    </UserContextProvider>
  );
};

export { AppProvider };
