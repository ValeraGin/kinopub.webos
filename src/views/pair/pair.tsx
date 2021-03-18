import { useLocation } from 'react-router-dom';

import Text from '../../components/text';

type Props = {};

type LocationState = {
  userCode: string;
  verificationUri: string;
};

const PairView: React.FC<Props> = () => {
  const location = useLocation<LocationState>();
  const { userCode, verificationUri } = location.state;

  return (
    <Text centered>
      Подтвердите устройство перейдя по ссылке:
      <br />
      {verificationUri}
      <br />
      и введите код:
      <br />
      {userCode}
    </Text>
  );
};

export default PairView;
