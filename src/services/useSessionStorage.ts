export const useSessionStorage = () => {
  const setItem = (key: string, item: any): void => {
    try {
      const stringItem = JSON.stringify(item);
      window.sessionStorage.setItem(key, stringItem);
    } catch (error) {}
  };

  const getItem = (key: string): any => {
    const item = window.sessionStorage.getItem(key) || false;
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {}
  };

  const removeItem = (key: string): void => {
    window.sessionStorage.removeItem(key);
  };

  const clear = (): void => {
    window.sessionStorage.clear();
  };

  return { setItem, getItem, removeItem, clear };
};
