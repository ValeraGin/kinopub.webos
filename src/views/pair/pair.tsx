import Seo from 'components/seo';
import useSearchParam from 'hooks/useSearchParam';

const PairView: React.FC = () => {
  const userCode = useSearchParam('userCode');
  const verificationUri = useSearchParam('verificationUri');

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
