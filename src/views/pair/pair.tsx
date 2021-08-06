import { useLocation } from 'react-router-dom';

import Seo from 'components/seo';

type LocationState = {
  userCode: string;
  verificationUri: string;
};

const PairView: React.FC = () => {
  const location = useLocation<LocationState>();
  const { userCode, verificationUri } = location.state || {};

  return (
    <>
      <Seo title="Авторизация" />
      <div className="w-screen h-screen flex justify-center items-center text-gray-200 text-center">
        Подтвердите устройство перейдя по ссылке:
        <br />
        {verificationUri}
        <br />
        и введите код:
        <br />
        {userCode}
      </div>
    </>
  );
};

export default PairView;
