export function cleanCurrency(currencyString) {
    const str = String(currencyString);
    return parseFloat(str.replace("R$", "").replace(/\./g, "").replace(",", "."));
};