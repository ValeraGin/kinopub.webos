import cx from 'classnames';

import Text, { TextProps } from 'components/text';

type Props = {} & TextProps;

const Title: React.FC<Props> = ({ children, className, ...props }) => {
  if (!children) {
    return null;
  }

  return (
    <Text {...props} className={cx('m-1 mb-3 h-9', className)}>
      {children}
    </Text>
  );
};

export default Title;
