import BookmarksList from 'components/bookmarksList';
import useApi from 'hooks/useApi';

const BooksmarksView: React.FC = () => {
  const { data, isLoading } = useApi('bookmarks');

  return (
    <>
      <BookmarksList bookmarks={data?.items} loading={isLoading} />
    </>
  );
};

export default BooksmarksView;
