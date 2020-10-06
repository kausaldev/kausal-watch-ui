import React, { useContext } from 'react';
import {
  Container,
} from 'reactstrap';

import styled from 'styled-components';
import { withTranslation } from '../common/i18n';

import Layout from '../components/layout';
import ActionHighlightsList from '../components/actions/ActionHighlightsList';
import IndicatorHighlightsList from '../components/indicators/IndicatorHighlightsList';
import HnhHero from '../components/HnhHero';
import FrontHero from '../components/FrontHero';
import ThlHero from '../components/ThlHero';
import HeroFullImage from '../components/home/HeroFullImage';
import PlanContext from '../context/plan';

const ActionsSection = styled.div`
  background-color: ${(props) => props.theme.neutralLight};
  position: relative;
  padding: ${(props) => props.theme.spaces.s800} 0 ${(props) => props.theme.spaces.s400};
  
  .container {
    text-align: center;
  }
`;

const IndicatorsSection = styled.div`
  background-color: ${(props) => props.theme.themeColors.white};
  color: ${(props) => props.theme.neutralDark};
  position: relative;
  padding: ${(props) => props.theme.spaces.s600} 0;

  .container {
    text-align: center;
  }
`;

function HomePage() {
  const plan = useContext(PlanContext);
  const generalContent = plan.generalContent || {};

  // Use default hero component
  let heroComponent = (
    <FrontHero
      bgImage={plan.mainImage?.smallRendition?.src || plan.imageUrl}
      title={generalContent.siteTitle}
      siteDescription={generalContent.siteDescription}
      actionsDescription={generalContent.actionShortDescription}
      indicatorsDescription={generalContent.indicatorShortDescription}
    />
  );

  // Override with plan specific hero if applicable
  if (plan.identifier === 'hnh2035') heroComponent = <HnhHero />;
  if (plan.identifier === 'ktstrat') heroComponent = <ThlHero />;
  if (plan.identifier === 'liiku' || plan.identifier === 'lahti-ilmasto') heroComponent = (
    <HeroFullImage
      bgImage={plan.imageUrl}
      title={generalContent.siteTitle}
      siteDescription={generalContent.siteDescription}
      actionsDescription={generalContent.actionShortDescription}
      indicatorsDescription={generalContent.indicatorShortDescription}
    />
  );

  return (
    <Layout>
      { heroComponent }
      <ActionsSection className="actions-section">
        <Container>
          <ActionHighlightsList plan={plan} />
        </Container>
      </ActionsSection>
      <IndicatorsSection className="indicators-section">
        <Container>
          <IndicatorHighlightsList plan={plan} />
        </Container>
      </IndicatorsSection>
    </Layout>
  );
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
});

export default withTranslation('common')(HomePage);
