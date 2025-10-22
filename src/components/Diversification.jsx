import React from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Diversification({ sortedData }) {

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const totalAmount = sortedData.reduce((acc, asset) => acc + asset.currentValue, 0);

    const data = sortedData.map((asset) => {

        const percentage = (asset.currentValue / totalAmount) * 100;

        return {
            name: asset.name,
            amount: percentage
        }
    });

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={14}>
                {`${data[index].name}`}
            </text>
        );
    };

    const renderCustomizedTooltip = ({ payload, active }) => {
        if (active && payload && payload.length) {
            const { amount } = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{fontSize: 16, color: '#808080', backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p>{`${amount.toFixed(2)}%`}</p> {/* Exibindo o percentual com 2 casas decimais */}
                </div>
            );
        }
        return null;
    };

    return (
        <DiversificationStyled>
            <TitleStyled>Diversificação</TitleStyled>

            <ContainerStyled>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="amount" // Usa "amount" como chave para o valor da fatia
                            nameKey="name"   // Usa "name" para os nomes das fatias
                            cx="50%"         // Centro do gráfico
                            cy="50%"         // Centro do gráfico
                            outerRadius={150} // Raio externo do gráfico de pizza
                            innerRadius={50}  // Raio interno (cria o "buraco" no meio)
                            labelLine={false} // Desativa as linhas de rótulo
                            label={renderCustomizedLabel} // Rótulo personalizado
                            animationDuration={1000} // Duração da animação
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={renderCustomizedTooltip}/>
                    </PieChart>
                </ResponsiveContainer>
            </ContainerStyled>

        </DiversificationStyled>
    )
}

const DiversificationStyled = styled.div`
    width: 100%;
    margin: 35px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        margin: 0;
    }
`

const TitleStyled = styled.h1`
    width: 100%;

    @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;

    }
`

const ContainerStyled = styled.div`
    display: flex; 
    justify-content: center;
    align-items: center;
    width: 100%;
`