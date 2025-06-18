export const useLocalStorage = () => {
  const setItem = (key: string, item: any): void => {
    try {
      const stringItem = JSON.stringify(item);
      window.localStorage.setItem(key, stringItem);
    } catch (error) {
      console.log("useLocalStorage.setItem", error);
    }
  };

  const getItem = (key: string): any => {
    try {
      const item = window.localStorage.getItem(key) || false;
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.log("useLocalStorage.getItem", error);
    }
  };

  const removeItem = (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log("useLocalStorage.removeItem", error);
    }
  };

  const clear = (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.log("useLocalStorage.clear", error);
    }
  };

  return { setItem, getItem, removeItem, clear };
};
