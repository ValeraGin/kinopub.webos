import { Helmet, HelmetProps } from 'react-helmet';

type Props = {} & HelmetProps;

const Seo: React.FC<Props> = (props) => {
  return <Helmet defaultTitle="Unknown" titleTemplate="%s | Kinopub WebOS" {...props} />;
};

export default Seo;
