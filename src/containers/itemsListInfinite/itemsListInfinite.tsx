import { Item } from 'api';
import ItemsList from 'components/itemsList';
import useInfiniteItems, { QueryResult } from 'hooks/useInfiniteItems';

type Props = {
  title?: string;
  queryResult: QueryResult;
  processItems?: (items: Item[]) => Item[];
};

const ItemsListInfinite: React.FC<Props> = ({ title, queryResult, processItems }) => {
  const [items, isLoading, fetchMore] = useInfiniteItems(queryResult, processItems);

  return <ItemsList title={title} items={items} loading={isLoading} onScrollToEnd={fetchMore} />;
};

export default ItemsListInfinite;
