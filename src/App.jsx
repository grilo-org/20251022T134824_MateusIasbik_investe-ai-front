import { useEffect, useState } from "react";
import styled from "styled-components";
import Id from "./components/Id";
import Balance from "./components/Balance";
import Operations from "./components/Operations";
import Diversification from "./components/Diversification";
import Assets from "./components/Assets";
import { useFrontId } from "./functions/UseFrontId";
import api from "./api";

export default function App() {

  const token = useFrontId();

  const [myMoney, setMyMoney] = useState(0);
  const [myAssets, setMyAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("nome");

  const sortedData = [...myAssets]
  .filter(item => item?.name)
  .sort((a, b) => {
    switch (sortCriteria) {
      case "nome":
        return a.name.localeCompare(b.name);
      case "valorInvestido":
        return b.acquisitionValue - a.acquisitionValue;
      case "lucro":
        const lucroA = a.currentValue - a.acquisitionValue;
        const lucroB = b.currentValue - b.acquisitionValue;
        return lucroB - lucroA;
      default:
        return 0;
    }
  });

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await api.get(`/${token}`);
        const { money, assets } = response.data;

        setMyMoney(money);
        setMyAssets(assets);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!myAssets.length) return;

    const fetchAssetPrices = async () => {

      const updatedAssets = await Promise.all(myAssets
        .filter(asset => asset && typeof asset === 'object' && asset.name)
        .map(async (asset) => {
        try {
          const response = await api.get(`/${asset.name}?token=gzt1E342VQo1gcijzdazAF`);
          const priceNow = Number(response.data.results[0].regularMarketPrice);
          const currentNow = Number((priceNow * asset.amount).toFixed(2));
          return { ...asset, price: priceNow, currentValue: currentNow };
        } catch (error) {
          console.error("Erro ao buscar o preço do ativo", error);
          return asset;
        }
      }));

      setMyAssets(updatedAssets);
    };

    fetchAssetPrices();
  }, [myMoney]);

  if (isLoading || myMoney === null) {
    return (
      <LoadingContainer>
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHRyc2xtdzZsZXR4eHE4eWViMmc1NHphOW5iMXFsaXA5bzF5cGg5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif"
          alt="Carregando seus dados..."
          />
      </LoadingContainer>
    );
  }

  return (
    <ScreenStyled>
      <TopStyled>Investe Aí</TopStyled>

      <ContainerStyled>
        <Id token={token} />
        <Balance sortedData={sortedData} MY_MONEY={myMoney} />
        <Operations MY_MONEY={myMoney} sortedData={sortedData} setMyMoney={setMyMoney} setMyAssets={setMyAssets} />
        <Diversification sortedData={sortedData} />
        <Assets sortedData={sortedData} sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
      </ContainerStyled>
    </ScreenStyled>
  )
}

const LoadingContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-top: -70px;
`;

const ScreenStyled = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const TopStyled = styled.div`
  width: 100%;
  background-color: #191919;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
  position: fixed;
  z-index: 3;

  @media (max-width: 768px) {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
  }
`;

const ContainerStyled = styled.div`
  position: relative;
  top: 70px;
  height: 100%;
  width: 1026px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #000;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 24px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
  }
`;

