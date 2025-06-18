import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import ICustomFieldListOption from "../interfaces/ICustomFieldListOption";

type PropsCustomFieldContext = {
  customFieldListOptionsContext: ICustomFieldListOption[];
  setCustomFieldListOptionsContext: Dispatch<
    SetStateAction<ICustomFieldListOption[]>
  >;
  clearCustomFieldListOptionsContext: () => void;
  initializeCustomFieldListOptionsContext: (
    customFieldListOptions: ICustomFieldListOption[]
  ) => void;
};

const CustomFieldListOptionsContext = createContext<PropsCustomFieldContext>(
  {} as PropsCustomFieldContext
);

const CustomFieldListOptionsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [customFieldListOptionsContext, setCustomFieldListOptionsContext] =
    useState<ICustomFieldListOption[]>([
      {
        id: uuidv4(),
        sequence: new Date().getTime(),
        customFieldId: "",
        description: "",
        selectedDefault: false,
      },
    ]);

  const clearCustomFieldListOptionsContext = () => {
    setCustomFieldListOptionsContext([
      {
        id: uuidv4(),
        sequence: new Date().getTime(),
        customFieldId: "",
        description: "",
        selectedDefault: false,
      },
    ]);
  };

  const initializeCustomFieldListOptionsContext = (
    customFieldListOptions: ICustomFieldListOption[]
  ) => {
    setCustomFieldListOptionsContext(customFieldListOptions);
  };

  return (
    <CustomFieldListOptionsContext.Provider
      value={{
        customFieldListOptionsContext,
        setCustomFieldListOptionsContext,
        clearCustomFieldListOptionsContext,
        initializeCustomFieldListOptionsContext,
      }}
    >
      {children}
    </CustomFieldListOptionsContext.Provider>
  );
};

function useCustomFieldListOptions(): PropsCustomFieldContext {
  const context = useContext(CustomFieldListOptionsContext);

  if (!context) {
    throw new Error(
      "useCustomFieldListOptions deve ser usado dentro de um CustomFieldListOptionsContextProvider"
    );
  }

  return context;
}

export { CustomFieldListOptionsContextProvider, useCustomFieldListOptions };
