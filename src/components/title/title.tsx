import cx from 'classnames';

import Text from 'components/text';

type Props = {
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Title: React.FC<Props> = ({ title, className, ...props }) => {
  if (!title) {
    return null;
  }

  return (
    <Text {...props} className={cx('m-1 mb-3', className)}>
      {title}
    </Text>
  );
};

export default Title;
