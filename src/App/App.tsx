import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

import View from '../components/view';
import Views from '../containers/views';
import { PATHS } from '../routes';
import BookmarkView from '../views/booksmark';
import BookmarksView from '../views/booksmarks';
import CategoryView from '../views/category';
import ChannelView from '../views/channel';
import ChannelsView from '../views/channels';
import CollectionView from '../views/collection';
import CollectionsView from '../views/collections';
import HistoryView from '../views/history';
import HomeView from '../views/home';
import ItemView from '../views/item';
import NotFoundView from '../views/notFound';
import PairView from '../views/pair';
import SearchView from '../views/search';
import SettingsView from '../views/settings';
import SpeedView from '../views/speed';
import TrailerView from '../views/trailer';
import VideoView from '../views/video';
import WatchingView from '../views/watching';

import './styles.less';

const queryClient = new QueryClient();

type Props = {};

const App: React.FC<Props> = (props) => {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Views {...props}>
          <View path={PATHS.Index} component={HomeView} exact />
          <View path={PATHS.Search} component={SearchView} />
          <View path={PATHS.Category} component={CategoryView} />
          <View path={PATHS.Watching} component={WatchingView} />
          <View path={PATHS.Bookmark} component={BookmarkView} />
          <View path={PATHS.Bookmarks} component={BookmarksView} />
          <View path={PATHS.Collection} component={CollectionView} />
          <View path={PATHS.Collections} component={CollectionsView} />
          <View path={PATHS.Channel} component={ChannelView} />
          <View path={PATHS.Channels} component={ChannelsView} />
          <View path={PATHS.History} component={HistoryView} />
          <View path={PATHS.Item} component={ItemView} />
          <View path={PATHS.Video} component={VideoView} />
          <View path={PATHS.Trailer} component={TrailerView} />
          <View path={PATHS.Pair} component={PairView} />
          <View path={PATHS.Speed} component={SpeedView} />
          <View path={PATHS.Settings} component={SettingsView} />
          <View component={NotFoundView} />
        </Views>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

export default MoonstoneDecorator(App);
