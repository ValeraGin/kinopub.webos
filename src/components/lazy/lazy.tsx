import { useContext } from 'react';
import LazyLoad, { LazyLoadProps } from 'react-lazyload';

import { ScrollableContext } from 'components/scrollable';

type Props = {
  className?: string;
} & Omit<LazyLoadProps, 'placeholder'>;

const Lazy: React.FC<Props> = (props) => {
  const { id: scrollableId } = useContext(ScrollableContext);

  return (
    <LazyLoad
      once
      offset={100}
      scrollContainer={scrollableId && `#${scrollableId}`}
      {...props}
      placeholder={<div className="w-full h-full" />}
    />
  );
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
