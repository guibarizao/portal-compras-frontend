export default function useFormatIntegerDecimalValues() {
  const formatIntegerDecimalValues = (
    value: number,
    type: "ALL" | "DECIMAL"
  ) => {
    if (type === "DECIMAL") {
      return new Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      if (String(value).indexOf(".") >= 1) {
        return new Intl.NumberFormat("pt-BR", {
          style: "decimal",
          minimumFractionDigits: 2,
        }).format(value);
      }

      return new Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(value);
    }
  };

  return { formatIntegerDecimalValues };
}
