import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Macbook } from '@/components/Macbook';
import { CTA } from '@/templates/CTA';
import { Features } from '@/templates/Features';
import { Footer } from '@/templates/Footer';
import { Hero } from '@/templates/Hero';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      <Navbar />
      <Hero />
      <Macbook />
      <Features />
      {/* <Pricing /> */}
      {/* <FAQ /> */}
      <CTA />
      <Footer />
    </>
  );
};

export default IndexPage;
