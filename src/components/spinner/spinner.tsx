import cx from 'classnames';

type Props = {
  className?: string;
};

const Spinner: React.FC<Props> = ({ className }) => {
  return (
    <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <i className={cx('animate-spin w-10 h-10 rounded-full border-t-4', className)} />
    </div>
  );
};

export default Spinner;
