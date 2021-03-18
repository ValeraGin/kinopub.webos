import BookmarksList from '../../components/bookmarksList';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';

type Props = {};

const BooksmarksView: React.FC<Props> = () => {
  const { data, isLoading } = useApi('bookmarks');

  return (
    <MainLayout>
      <BookmarksList bookmarks={data?.items} loading={isLoading} />
    </MainLayout>
  );
};

export default BooksmarksView;
