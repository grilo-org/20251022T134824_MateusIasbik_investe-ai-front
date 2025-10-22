import axios from "axios";
import { toast } from 'react-toastify';
import { formatCurrency } from "./FormatCurrency";


export function getActionFromAPIWhenBuyOrSell(action, BRAPI_API, setValue, setPlaceholder, amount) {
    
    axios.get(BRAPI_API)
        .then((response) => {
            const priceNow = response.data.results[0].regularMarketPrice;
            
            if (priceNow) {
                const numericValue = formatCurrency(amount * priceNow);

                setValue(numericValue);
            } else {
                setValue("R$ 0,00");
                setPlaceholder("");
            }
        })
        .catch((error) => {
            if (action.length >= 6) {
                toast.error("O ativo digitado não existe, tente novamente!");
            }
            setValue("");
        });

}