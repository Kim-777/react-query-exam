import { useParams } from "react-router-dom";
import styled from "styled-components";

const H1 = styled.h1`
  font-size: 30px;
  color: ${(props) => props.theme.textColor};
`;

function Coin() {
  const { coinId } = useParams();

  console.log("params ::: ", coinId);

  return (
    <>
      <H1>코인 이름은: {coinId}</H1>
      <a>hi</a>
    </>
  );
}

export default Coin;
