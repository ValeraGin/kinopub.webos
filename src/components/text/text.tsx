import cx from 'classnames';

type Props = {
  className?: string;
};

const Text: React.FC<Props> = ({ className, ...props }) => {
  return <p {...props} className={cx('text-primary', className)} />;
};

export default Text;
