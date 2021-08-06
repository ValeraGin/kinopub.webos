import 'styles/global.css';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

import Router from 'components/router';
import View from 'components/view';
import Views from 'containers/views';
import { PATHS } from 'routes';

const BookmarkView = React.lazy(() => import('views/booksmark'));
const BookmarksView = React.lazy(() => import('views/booksmarks'));
const CategoryView = React.lazy(() => import('views/category'));
const GenreView = React.lazy(() => import('views/genre'));
const ChannelView = React.lazy(() => import('views/channel'));
const ChannelsView = React.lazy(() => import('views/channels'));
const CollectionView = React.lazy(() => import('views/collection'));
const CollectionsView = React.lazy(() => import('views/collections'));
const HistoryView = React.lazy(() => import('views/history'));
const HomeView = React.lazy(() => import('views/home'));
const IndexView = React.lazy(() => import('views/index'));
const ItemView = React.lazy(() => import('views/item'));
const NotFoundView = React.lazy(() => import('views/notFound'));
const PairView = React.lazy(() => import('views/pair'));
const SearchView = React.lazy(() => import('views/search'));
const SettingsView = React.lazy(() => import('views/settings'));
const DonateView = React.lazy(() => import('views/donate'));
const SpeedView = React.lazy(() => import('views/speed'));
const TrailerView = React.lazy(() => import('views/trailer'));
const VideoView = React.lazy(() => import('views/video'));
const WatchingView = React.lazy(() => import('views/watching'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

type Props = {};

const App: React.FC<Props> = (props) => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Views {...props}>
          <View path={PATHS.Index} component={IndexView} layout="fill" exact />
          <View path={PATHS.Home} component={HomeView} />
          <View path={PATHS.Search} component={SearchView} />
          <View path={PATHS.Category} component={CategoryView} />
          <View path={PATHS.Genre} component={GenreView} />
          <View path={PATHS.Watching} component={WatchingView} />
          <View path={PATHS.Bookmark} component={BookmarkView} />
          <View path={PATHS.Bookmarks} component={BookmarksView} />
          <View path={PATHS.Collection} component={CollectionView} />
          <View path={PATHS.Collections} component={CollectionsView} />
          <View path={PATHS.Channel} component={ChannelView} layout="fill" />
          <View path={PATHS.Channels} component={ChannelsView} />
          <View path={PATHS.History} component={HistoryView} />
          <View path={PATHS.Item} component={ItemView} layout="fill" />
          <View path={PATHS.Video} component={VideoView} layout="fill" />
          <View path={PATHS.Trailer} component={TrailerView} layout="fill" />
          <View path={PATHS.Pair} component={PairView} layout="fill" />
          <View path={PATHS.Donate} component={DonateView} />
          <View path={PATHS.Speed} component={SpeedView} />
          <View path={PATHS.Settings} component={SettingsView} />
          <View component={NotFoundView} />
        </Views>
      </QueryClientProvider>
    </Router>
  );
};

export default MoonstoneDecorator(App);
