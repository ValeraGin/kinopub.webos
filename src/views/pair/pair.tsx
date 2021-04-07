import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
`;

type LocationState = {
  userCode: string;
  verificationUri: string;
};

const PairView: React.FC = () => {
  const location = useLocation<LocationState>();
  const { userCode, verificationUri } = location.state;

  return (
    <>
      <Wrapper>
        Подтвердите устройство перейдя по ссылке:
        <br />
        {verificationUri}
        <br />
        и введите код:
        <br />
        {userCode}
      </Wrapper>
    </>
  );
};

export default PairView;
