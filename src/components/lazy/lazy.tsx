import { useContext } from 'react';
// eslint-disable-next-line
import LazyLoad, { LazyLoadProps } from 'react-lazyload';

import { ScrollableContext } from 'components/scrollable';

type Props = {
  className?: string;
} & LazyLoadProps;

const Lazy: React.FC<Props> = (props) => {
  // eslint-disable-next-line
  const { id: scrollableId } = useContext(ScrollableContext);

  // return <LazyLoad once offset={100} scrollContainer={scrollableId && `#${scrollableId}`} {...props} />;

  // @ts-expect-error
  return <div {...props} />;
};

export function withLazy(options: Props) {
  return function WithLazy<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props: P) => (
      <Lazy {...options}>
        <Component {...props} />
      </Lazy>
    );
  };
}

export default Lazy;
