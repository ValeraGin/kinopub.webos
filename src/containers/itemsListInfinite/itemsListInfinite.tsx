import { Item } from 'api';
import ItemsList from 'components/itemsList';
import useInfiniteItems, { QueryResult } from 'hooks/useInfiniteItems';

type Props = {
  title?: React.ReactNode;
  showResult?: boolean;
  queryResult: QueryResult;
  processItems?: (items: Item[]) => Item[];
};

const ItemsListInfinite: React.FC<Props> = ({ title, showResult = true, queryResult, processItems }) => {
  const [items, isLoading, fetchMore] = useInfiniteItems(queryResult, processItems);

  return <ItemsList title={title} items={items} loading={showResult && isLoading} onScrollToEnd={fetchMore} />;
};

export default ItemsListInfinite;
