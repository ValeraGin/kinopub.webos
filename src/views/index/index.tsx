import Seo from 'components/seo';
import Spinner from 'components/spinner';

const IndexView: React.FC = () => {
  return (
    <>
      <Seo title="Загрузчик" />
      <Spinner />
    </>
  );
};

export default IndexView;
