import { ThemeProvider } from 'theme-ui';
import React from 'react';
import theme from './theme';
import Layout from './components/layout';
import Banner from './sections/banner';
import Services from './sections/services';
import OurTeam from './sections/our-team';
import SubscribeUs from './sections/subscribe-us';

export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Banner />
        <Services />
        <OurTeam />
        <SubscribeUs />
      </Layout>
    </ThemeProvider>
  );
}
