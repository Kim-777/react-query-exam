import React from "react";
import { useQuery } from "react-query";
import {
  useLocation,
  useParams,
  Outlet,
  Link,
  useMatch,
} from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { fetchCoinMetaInfo, fetchCoinPriceInfo } from "../api";

const Overview = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) =>
    props.isDark ? "whitesmoke" : "rgba(0, 0, 0, 0.5)"};
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  color: ${(props) => props.theme.textColor};

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  a {
    display: block;
    color: ${(props) => (props.isActive ? "skyblue" : "white")};
  }
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.div`
  text-align: center;
`;

interface ILocation {
  state: {
    name: string;
  };
}

interface ITag {
  coin_counter: number;
  ico_counter: number;
  id: string;
  name: string;
}

export interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  tags?: ITag[];
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

export interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

export default function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as ILocation;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const { isLoading: metaInfoLoading, data: metaInfoData } =
    useQuery<IInfoData>(["info", coinId], () =>
      fetchCoinMetaInfo(coinId as string)
    );
  const { isLoading: priceInfoLoading, data: priceInfoData } =
    useQuery<IPriceData>(
      ["price", coinId],
      () => fetchCoinPriceInfo(coinId as string),
      {
        refetchInterval: 5000,
      }
    );

  const loading = metaInfoLoading || priceInfoLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name
            ? state?.name
            : loading
            ? "loading... "
            : metaInfoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name
            ? state?.name
            : loading
            ? "loading... "
            : metaInfoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>loading...</Loader>
      ) : (
        <>
          <Overview isDark={false}>
            <OverviewItem>
              <span>Rank:</span>
              <span>{metaInfoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${metaInfoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>
                {priceInfoData?.quotes.USD.price
                  ? `${priceInfoData?.quotes.USD.price.toFixed(2)}`
                  : "-"}
              </span>
            </OverviewItem>
          </Overview>
          <Description>{metaInfoData?.description}</Description>
          <Overview isDark={false}>
            <OverviewItem>
              <span>Total suply</span>
              <span>{priceInfoData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfoData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={!!chartMatch}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={!!priceMatch}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
}
