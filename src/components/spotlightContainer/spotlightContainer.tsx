import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

const SpotlightContainer = SpotlightContainerDecorator(
  { enterTo: 'default-element', defaultElement: '.spottable', preserveId: true },
  (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
);

export default SpotlightContainer;
