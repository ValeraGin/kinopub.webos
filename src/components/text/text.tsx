import cx from 'classnames';

export type TextProps = {
  as?: string | React.ElementType;
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement>;

const Text: React.FC<TextProps> = ({ className, as: As = 'p', ...props }) => {
  return <As {...props} className={cx('text-gray-200', className)} />;
};

export default Text;
