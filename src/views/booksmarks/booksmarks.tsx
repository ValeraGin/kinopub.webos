import BookmarksList from 'components/bookmarksList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const BooksmarksView: React.FC = () => {
  const { data, isLoading } = useApi('bookmarks');
  const title = 'Закладки';

  return (
    <>
      <Seo title={title} />
      <BookmarksList title={title} bookmarks={data?.items} loading={isLoading} />
    </>
  );
};

export default BooksmarksView;
