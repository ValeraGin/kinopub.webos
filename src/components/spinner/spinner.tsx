import MoonstoneSpinner, { SpinnerProps } from '@enact/moonstone/Spinner';

type Props = {} & Omit<SpinnerProps, 'component'>;

const Spinner: React.FC<Props> = (props) => {
  // @ts-expect-error
  return <MoonstoneSpinner {...props} centered />;
};

export default Spinner;
