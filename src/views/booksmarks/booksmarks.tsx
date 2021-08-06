import BookmarksList from 'components/bookmarksList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const BooksmarksView: React.FC = () => {
  const { data, isLoading } = useApi('bookmarks');

  return (
    <>
      <Seo title="Закладки" />
      <BookmarksList bookmarks={data?.items} loading={isLoading} />
    </>
  );
};

export default BooksmarksView;
