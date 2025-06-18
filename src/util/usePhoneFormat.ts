const usePhoneFormat = () => {
  const formatPhone = (phone: string) => {
    phone = phone
      ?.replaceAll(" ", "")
      ?.replaceAll("+", "")
      ?.replaceAll("(", "")
      ?.replaceAll(")", "")
      ?.replaceAll("-", "");
    if (!phone) {
      return "";
    } else if (phone.length === 11) {
      // Ex: (99) 99999-9999
      return `(${phone.substring(0, 2)}) ${phone.substring(
        2,
        7
      )}-${phone.substring(7, 11)}`;
    } else if (phone.length === 10) {
      // Ex: (99) 9999-9999
      return `(${phone.substring(0, 2)}) ${phone.substring(
        2,
        6
      )}-${phone.substring(6, 10)}`;
    } else if (phone.length === 9) {
      // Ex: 99999-9999
      return `${phone.substring(0, 5)}-${phone.substring(5, 9)}`;
    } else if (phone.length === 8) {
      // Ex: 9999-9999
      return `${phone.substring(0, 4)}-${phone.substring(4, 8)}`;
    } else {
      return phone;
    }
  };

  return { formatPhone };
};

export default usePhoneFormat;
