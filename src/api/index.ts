export const fetchCoins = async () => {
  return fetch("https://api.coinpaprika.com/v1/coins").then((response) =>
    response.json()
  );
};

export const fetchCoinMetaInfo = (coinId: string) => {
  return fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`).then(
    (response) => response.json()
  );
};

export const fetchCoinPriceInfo = (coinId: string) => {
  return fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`).then(
    (response) => response.json()
  );
};
