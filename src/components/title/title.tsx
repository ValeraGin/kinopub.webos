import cx from 'classnames';

import Text, { TextProps } from 'components/text';

type Props = {} & TextProps;

const Title: React.FC<Props> = ({ children, className, ...props }) => {
  if (!children) {
    return null;
  }

  return (
    <Text {...props} className={cx('flex justify-between items-center mx-2 my-1 mb-3 min-h-9', className)} as="div">
      {children}
    </Text>
  );
};

export default Title;
