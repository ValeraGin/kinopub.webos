import { Item } from 'api';
import ItemsList from 'components/itemsList';
import useInfiniteItems, { QueryResult } from 'hooks/useInfiniteItems';

type Props = {
  queryResult: QueryResult;
  processItems?: (items: Item[]) => Item[];
};

const ItemsListInfinite: React.FC<Props> = ({ queryResult, processItems }) => {
  const [items, isLoading, fetchMore] = useInfiniteItems(queryResult, processItems);

  return <ItemsList items={items} loading={isLoading} onScrollToEnd={fetchMore} />;
};

export default ItemsListInfinite;
