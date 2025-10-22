import React from "react";
import styled from "styled-components";
import { formatCurrency } from "../functions/FormatCurrency";

export default function Balance( {sortedData, MY_MONEY}) {

    const investmentEquity = sortedData.reduce((acc, asset) => {
        return acc + asset.currentValue;
    }, 0);

    return (
        <OperationsStyled>
            <BoxStyled>
                <h1>Disponível para investir</h1>
                <h2>{formatCurrency(MY_MONEY)}</h2>
            </BoxStyled>
            <BoxStyled>
                <h1>Patrimônio de investimentos</h1>
                <h3>{formatCurrency(investmentEquity)}</h3>
            </BoxStyled>
        </OperationsStyled>
    )
}

const OperationsStyled = styled.div`
    width: 100%;
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    justify-content: space-between;

    @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const BoxStyled = styled.div`
    display: flex;
    border-radius: 11px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 140px;
    width: 48%;
    background-color: #F1F5F8;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    
    h1 {
        font-size: 16px;
        color: #000000;
        padding-bottom: 10px;
    }

    h2 {
        font-size: 40px;
        color: #191919;
    }

    h3 {
        font-size: 40px;
        color: #205934;
    }

    @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
`