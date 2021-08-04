import cx from 'classnames';

import Spottable from 'components/spottable';

type Props = {
  className?: string;
  wrapperClassName?: string;
  source?: string;
  caption?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ImageItem: React.FC<Props> = ({ className, wrapperClassName, source, caption, children, ...props }) => {
  return (
    <Spottable {...props} className={cx('rounded-xl w-1/6', wrapperClassName)}>
      <div className={cx('h-40 m-1 flex flex-col relative overflow-hidden cursor-pointer', className)}>
        <img loading="lazy" className="w-full h-full object-cover rounded-xl bg-gray-300" src={source} alt={caption} />
        <div className="px-2">
          <p className="text-primary text-sm text-center overflow-hidden whitespace-nowrap">{caption}</p>
        </div>

        {children}
      </div>
    </Spottable>
  );
};

export default ImageItem;
