import cx from 'classnames';

import Lazy from 'components/lazy';
import Spottable from 'components/spottable';

type Props = {
  className?: string;
  wrapperClassName?: string;
  source?: string;
  caption?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ImageItem: React.FC<Props> = ({ className, wrapperClassName, source, caption, children, ...props }) => {
  return (
    <Spottable {...props} className={cx('rounded-xl w-1/5 cursor-pointer', wrapperClassName)}>
      <Lazy className={cx('h-40 m-1 flex flex-col relative', className)}>
        <img
          loading="lazy"
          className="w-full h-full object-cover rounded-xl border-2 border-gray-300 bg-gray-300"
          src={source}
          alt={caption}
        />

        {children}
      </Lazy>
      {caption && (
        <div className="px-2">
          <p className="text-gray-200 text-sm text-center overflow-hidden overflow-ellipsis whitespace-nowrap">{caption}</p>
        </div>
      )}
    </Spottable>
  );
};

export default ImageItem;
