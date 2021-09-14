import Seo from 'components/seo';
import HistoryListInfinite from 'containers/historyListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';

const HistoryView: React.FC = () => {
  const queryResult = useApiInfinite('history');
  const title = 'История просмотров';

  return (
    <>
      <Seo title={title} />
      <HistoryListInfinite title={title} queryResult={queryResult} />;
    </>
  );
};

export default HistoryView;
