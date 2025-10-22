import React from "react";
import styled from "styled-components";

export default function Id({ token }) {

    return (
        <IdStyled>
            <h1>Seu id de investidor é: {token}</h1>
        </IdStyled>
    )
}

const IdStyled = styled.div`
    width: 100%;

    h1 {
        margin: 25px 0;
        color: #000000;
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        h1 {
            font-size: 14px;
            width: 90%;
            text-align: center;
        }
    
    }
`