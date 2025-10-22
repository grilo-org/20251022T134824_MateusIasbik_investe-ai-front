import React from "react";
import styled from "styled-components";
import { formatCurrency } from "../functions/FormatCurrency";

export default function Asset({ assetsWithProfitOrLoss }) {
    return (
        <>
            {assetsWithProfitOrLoss.map((asset) => (
                <BoxStyled key={asset.id || asset.name}>

                    <h1>{asset.name}</h1>

                    <BoxInformationAssetsStyled>
                        <div>
                            <h2>Cotação</h2>
                            <p>{formatCurrency(asset.price)}</p>
                        </div>

                        <div>
                            <h2>Quantidade</h2>
                            <p>{asset.amount}</p>
                        </div>

                        <div>
                            <h2>Valor Atual</h2>
                            <p>{formatCurrency(asset.currentValue)}</p>
                        </div>

                        <div>
                            <h2>Valor de Aquisição</h2>
                            <p>{formatCurrency(asset.acquisitionValue)}</p>
                        </div>
                    </BoxInformationAssetsStyled>

                    <ProfitOrLossStyled>
                        <h2>Lucro ou Prejuízo</h2>
                        <h3
                            style={{
                                color: asset.profitOrLoss < 0 ? '#E43E3E' : '#205934'
                            }}
                        >{formatCurrency(Math.abs(asset.profitOrLoss))}</h3>
                    </ProfitOrLossStyled>

                </BoxStyled>

            ))}


        </>
    )
}


const BoxStyled = styled.div`
    border: 1px solid #DBDBDB;
    display: flex;
    align-items: center;
    border-radius: 10px;
    height: 91px;
    width: 100%;
    margin-bottom: 15px;
    
    h1 {
        color: #000000;
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        padding-left: 25px;
        width: 10%;
    }
    
    h2 {
        color: #5B6D76;
        font-size: 16px;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        padding-bottom: 5px;
    }
    
    p {
        padding-top: 2px;
        color: #000000;
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
    }

    h3 {
        padding-top: 2px;
        color: #205934;
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
    }

    @media (max-width: 768px) {
        width: 80%;
        height: 224px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        h1 {
            padding: 10px 0;
            width: auto;
        }
    }
`

const BoxInformationAssetsStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    padding-right: 3%;

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    @media (max-width: 768px) {
        height: 70%;
        width: 100%;
        flex-wrap: wrap;
        display: flex;
        justify-content: space-evenly;

        div {
            width: 45%;
            height: 45%;
        }

        h2 {
            width: 100%;
            text-align: center;
        }
    }
`

const ProfitOrLossStyled = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 25px;

    h2 {
        color: #5B6D76;
        text-align: center;
    }

    @media (max-width: 768px) {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
    }
`