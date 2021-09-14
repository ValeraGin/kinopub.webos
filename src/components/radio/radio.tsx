import React from 'react';

import Checkbox, { CheckboxProps } from 'components/checkbox';

type Props = {} & CheckboxProps;

const Radio: React.FC<Props> = (props) => {
  return <Checkbox {...props} type="radio" />;
};

export default Radio;
