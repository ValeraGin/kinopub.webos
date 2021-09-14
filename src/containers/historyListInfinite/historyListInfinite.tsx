import { HistoryItem } from 'api';
import HistoryList from 'components/historyList';
import useInfiniteItems, { QueryResult } from 'hooks/useInfiniteItems';

type Props = {
  title?: React.ReactNode;
  showResult?: boolean;
  queryResult: QueryResult;
  processItems?: (items: HistoryItem[]) => HistoryItem[];
};

const ItemsListInfinite: React.FC<Props> = ({ title, showResult = true, queryResult, processItems }) => {
  const [items, isLoading, fetchMore] = useInfiniteItems(queryResult, processItems, 'history', 'last_seen');

  return <HistoryList title={title} items={items} loading={showResult && isLoading} onScrollToEnd={fetchMore} />;
};

export default ItemsListInfinite;
