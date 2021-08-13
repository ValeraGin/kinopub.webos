import { Collection } from 'api';
import CollectionsList from 'components/collectionsList';
import useInfiniteItems, { QueryResult } from 'hooks/useInfiniteItems';

type Props = {
  title?: React.ReactNode;
  queryResult: QueryResult;
  processItems?: (items: Collection[]) => Collection[];
};

const CollectionsListInfinite: React.FC<Props> = ({ title, queryResult, processItems }) => {
  const [items, isLoading, fetchMore] = useInfiniteItems(queryResult, processItems);

  return <CollectionsList title={title} collections={items} loading={isLoading} onScrollToEnd={fetchMore} />;
};

export default CollectionsListInfinite;
