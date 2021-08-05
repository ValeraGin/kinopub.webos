import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

export const CONFIG = {
  enterTo: 'default-element',
  defaultElement: '.spottable',
  selector: '.spottable',
  overflow: true,
  preserveId: true,
};

const SpotlightContainer = SpotlightContainerDecorator(CONFIG, (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />);

export default SpotlightContainer;
