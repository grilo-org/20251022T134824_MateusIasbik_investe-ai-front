import React from "react";
import styled from "styled-components";
import Asset from "../components/Asset";

export default function Assets({ sortedData, sortCriteria, setSortCriteria }) {

    const assetsWithProfitOrLoss = sortedData.map((asset) => {
        const resultProfitOrLoss = asset.currentValue - asset.acquisitionValue;

        const newAssets = {
            ...asset,
            profitOrLoss: resultProfitOrLoss
        };

        return newAssets;
    });

    return (
        <>
            <TitleStyled>Ativos</TitleStyled>
            <SortControls>
                <label htmlFor="sort">Ordenar por:</label>
                <select
                    id="sort"
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value)}
                >
                    <option value="nome">Nome da Ação (A-Z)</option>
                    <option value="valorInvestido">Valor Investido</option>
                    <option value="lucro">Lucro</option>
                </select>
            </SortControls>

            <AssetsStyled>
                <Asset assetsWithProfitOrLoss={assetsWithProfitOrLoss} />
            </AssetsStyled>
        </>
    )
}

const SortControls = styled.div`
  margin: 20px 0;
  font-family: 'Roboto', sans-serif;

  label {
    margin-right: 10px;
    font-size: 16px;
  }

  select {
    font-size: 16px;
    padding: 5px 10px;
  }
`;

const TitleStyled = styled.h1`
    border-top: 1px solid #DEDEDF;
    padding: 30px 0;
    margin: 0px 0;
    width: 100%;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`

const AssetsStyled = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`   