import { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { getActionFromAPIWhenBuyOrSell } from "../functions/GetActionFromAPIWhenBuyOrSell";
import { formatCurrency } from "../functions/FormatCurrency";
import { cleanCurrency } from "../functions/CleanCurrency";
import { useFrontId } from "../functions/UseFrontId";
import api from "../api";

export default function Operations({ MY_MONEY, sortedData, setMyMoney, setMyAssets }) {

    const [orderType, setOrderType] = useState("Compra");
    const [action, setAction] = useState("");
    const [amount, setAmount] = useState("");
    const [value, setValue] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const BRAPI_API = `https://brapi.com.br/api/quote/${action}?token=gzt1E342VQo1gcijzdazAF`

    const token = useFrontId();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    useEffect(() => {

        if (orderType === "Aporte") {
            setValue("");
            setPlaceholder("R$ 0,00");
            setAmount("");
            setAction("");
        }

        if (orderType !== "Aporte") {

            if (action.length < 5) {
                setValue("");
                setPlaceholder("");
                return;
            }

            if (action.length >= 5 && !amount) {
                setAmount("100");
            }

            if (action.length >= 5 && amount) {
                getActionFromAPIWhenBuyOrSell(action, BRAPI_API, setValue, setPlaceholder, amount);
            }
        }

    }, [action, amount, orderType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericValue = parseFloat(value.replace(",", "."));

        if (orderType === "Aporte" && numericValue <= 10000 && numericValue > 0) {
            const newMoney = MY_MONEY + numericValue;

            const modelToPass = {
                frontId: token,
                money: newMoney,
                assets: []
            }

            await api.post("/", modelToPass);

            setMyMoney(MY_MONEY + numericValue);
            setValue("");
            toast.success(`O aporte de ${formatCurrency(numericValue)} foi realizado com sucesso!`);
        } else if (orderType === "Aporte" && isNaN(numericValue) || numericValue <= 0 || numericValue > 10000) {
            toast.error("O valor do aporte deve ser um número e estar entre R$ 1,00 e R$10.000,00");
        }

        if (orderType === "Compra" && cleanCurrency(value) > MY_MONEY) {
            toast.error("Não há saldo suficiente, faça um aporte ou reduza a quantidade a ser adquirida!");
            return;
        }

        if (orderType === "Compra" && value && amount && action) {
            axios.get(BRAPI_API)
                .then(async (response) => {
                    // const lastID = (sortedData.length === 0) ? 1 : sortedData[sortedData.length - 1].id + 1; // MUDAR ISTO, PEGAR ID DO BANCO CRIADO AUTOMATICAMENTE
                    const correctName = response.data.results[0].symbol;
                    const priceNow = Number(response.data.results[0].regularMarketPrice);
                    const acquisitionValue = (cleanCurrency(value));
                    const currentValueNumber = parseFloat((priceNow * amount).toFixed(2));

                    const newMoney = MY_MONEY - cleanCurrency(value);
                    const newAction = {
                        // id: lastID, //VERIFICAR ID - PROVAVELMENTE REVEMOR ID AQUI
                        name: String(correctName),
                        price: Number(priceNow),
                        amount: Number(amount),
                        currentValue: Number(currentValueNumber),
                        acquisitionValue: Number(acquisitionValue)
                    }

                    if (!sortedData.some(item => item.name === correctName)) {

                        const modelToPass = {
                            frontId: token,
                            money: newMoney,
                            assets: [newAction]
                        }

                        await api.post("/", modelToPass);

                        toast.success(`A compra de ${amount} ações de ${action.toUpperCase()} foi realizada com sucesso!`);

                        setMyAssets([...sortedData, newAction]);

                        setValue("");
                        setAction("");
                        setMyMoney(MY_MONEY - cleanCurrency(value));

                    } else {
                        const newData = await Promise.all(sortedData.map(async item => {
                            if (item.name.toUpperCase() === correctName.toUpperCase()) {
                                const existingAction = {
                                    ...item,
                                    amount: Number(item.amount) + Number(amount),
                                    currentValue: Number((priceNow * (Number(item.amount) + Number(amount))).toFixed(2)),
                                    acquisitionValue: item.acquisitionValue + Number(cleanCurrency(value))
                                }

                                const { id, userId, ...actionWithoutId } = existingAction;

                                const modelToPass = {
                                    frontId: token,
                                    money: newMoney,
                                    assets: [actionWithoutId]
                                }



                                await api.post("/", modelToPass);
                                return existingAction;
                            }

                            return item;

                        }));

                        toast.success(`A compra de ${amount} ações de ${action.toUpperCase()} foi realizada com sucesso!`);

                        setMyAssets(newData);

                        setValue("");
                        setAction("");
                        setMyMoney(MY_MONEY - cleanCurrency(value));

                    }
                })

                .catch((error) => {
                    console.error("Erro ao buscar o banco de dados!", error);
                });
        }

        if (orderType === "Venda" && value && amount && action) {
            axios.get(BRAPI_API)
                .then(async (response) => {
                    const priceNow = Number(response.data.results[0].regularMarketPrice);
                    const currentValueNumber = priceNow * amount;

                    const actionExists = sortedData.some(
                        act => act.name.toUpperCase() === action.toUpperCase()
                    );

                    if (!actionExists) {
                        toast.error(`Você não possui ativos de ${action.toUpperCase()} para venda.`);
                        return;
                    }

                    const promises = sortedData.map(async act => {
                        if (act.name.toUpperCase() === action.toUpperCase()) {
                            if (Number(act.amount) < Number(amount)) {
                                toast.error(`A quantidade máxima de ações que você pode vender é de ${act.amount}`);
                                return act;
                            }

                            const newAmount = Number(act.amount) - Number(amount);
                            const newMoney = Number(MY_MONEY + currentValueNumber);

                            const updateAction = {
                                ...act,
                                amount: Number(newAmount),
                                currentValue: Number((priceNow * newAmount).toFixed(2)),
                                acquisitionValue: Number(newAmount > 0
                                    ? Number(((act.acquisitionValue / act.amount) * newAmount).toFixed(2))
                                    : 0)
                            };

                            let { id, userId, ...actionWithoutId } = updateAction;

                            if (newAmount === 0) {
                                actionWithoutId = {
                                    ...actionWithoutId,
                                    amount: 0,
                                    currentValue: 1,
                                    acquisitionValue: 1
                                };
                            }

                            const modelToPass = {
                                frontId: token,
                                money: newMoney,
                                assets: [actionWithoutId]
                            };

                            await api.post("/", modelToPass);

                            return updateAction;
                        }

                        return act;
                    });

                    const results = await Promise.all(promises);

                    toast.success(`A venda de ${amount} ações de ${action.toUpperCase()} foi realizada com sucesso!`);
                    setMyMoney(Number(MY_MONEY + currentValueNumber));

                    const filteredAssets = results.filter(asset => asset.amount > 0);
                    setMyAssets(filteredAssets);

                    setValue("");
                    setAmount("100");
                    setAction("");
                })
                .catch((error) => {
                    console.error("Erro ao buscar o banco de dados!", error);
                    toast.error("Erro ao realizar a venda. Tente novamente.");
                });
        }


    };

    return (
        <>
            <TitleStyled>Operações</TitleStyled>
            <OperationsStyled>

                <InputStyled>
                    <div>
                        <h2 htmlFor="name">Tipo de ordem</h2>
                        <select
                            type=""
                            id="orderType"
                            value={orderType}
                            onChange={e => setOrderType(e.target.value)}
                        >
                            <option value="Aporte">Aporte</option>
                            <option value="Compra">Compra</option>
                            <option value="Venda">Venda</option>
                        </select>
                    </div>

                    <div>
                        <h2 htmlFor="name">Ativo</h2>
                        <input
                            type="text"
                            id="action"
                            placeholder="Ação"
                            maxLength={6}
                            value={action}
                            onChange={e => setAction(e.target.value)}
                            disabled={orderType === "Aporte"}
                        />
                    </div>

                    <div>
                        <h2 htmlFor="name">Quantidade</h2>
                        <input
                            type="number"
                            id="amount"
                            placeholder={amount}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            disabled={orderType === "Aporte"}
                        />
                    </div>

                    <div>
                        <h2 htmlFor="name">Valor</h2>
                        <input
                            type="value"
                            id="value"
                            placeholder={placeholder}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={orderType === "Compra" || orderType === "Venda"}
                        />
                    </div>

                    <button onClick={handleSubmit} type="submit">Registrar</button>

                </InputStyled>

            </OperationsStyled>

            <ToastContainer style={{ fontSize: 14, color: '#CCC', padding: '80px 10px' }}
                toastStyle={{
                    lineHeight: "1.4",
                    backgroundColor: '#333',
                    color: '#fff'
                }}

            />
        </>
    )
}

const TitleStyled = styled.h1`
    width: 100%;
    margin: 35px 0;

    @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }
`

const OperationsStyled = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 123px;
    border-radius: 10px;
    background-color: #F6F6F6;
`

const InputStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: #000;

    h2 {
        font-size: 16px;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        color: #000;
    }

    select, input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        height: 42px;
        width: 160px;
        font-family: 'Roboto', sans-serif;
        padding: 0 11px;
        margin: 10px 0 0 0;
        border: 1px solid #DBDBDB;
    }

    select {
        width: 190px;
        height: 45px;
    }

    button {
        background-color: #4AE07F;
        color: #000;
        font-size: 16px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        border: none;
        height: 60px;
        width: 180px;
        margin-top: 1%;
    }

    @media (max-width: 768px) {
        display: flex;
        height: 470px;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;

        h2 {
            display: flex;
            justify-content: center;
        }
    }
`