import cx from 'classnames';

type Props = {
  className?: string;
};

const Text: React.FC<Props> = ({ className, ...props }) => {
  return <p {...props} className={cx('text-gray-200', className)} />;
};

export default Text;
