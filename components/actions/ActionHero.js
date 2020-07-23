import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Badge,
} from 'reactstrap';
import styled, { withTheme } from 'styled-components';

import { ActionLink, ActionListLink } from '../../common/links';
import { withTranslation } from '../../common/i18n';
import Icon from '../common/Icon';

const Hero = styled.header`
  position: relative;
  margin-bottom: 3rem;
  a {
    color: ${(props) => props.theme.brandLight};

    &:hover {
      color: ${(props) => props.theme.brandLight};
    }
  }
`;

const ActionBgImage = styled.div`
  background-color: ${(props) => props.bgColor};
  background-image: url(${(props) => props.bgImage});
  background-position: center;
  background-size: cover;
  background-blend-mode: multiply;
`;

const VisuallyHidden = styled.span`
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0) !important;
  clip-path: inset(50%) !important;
  border: 0 !important;
  white-space: nowrap !important;
`;

const OverlayContainer = styled.div`
  color: white;
  padding: 2rem 0;
`;

const ActionsNav = styled.nav`
  font-size: 1rem;

  @media (max-width: ${(props) => props.theme.breakpointMd}) {
    font-size: 0.9rem;
  }
`;

const NavDivider = styled.span`
  &::after {
    content: ' | ';
  }
`;

const IndexLink = styled.span`
  font-size: 1.5rem;
  font-weight: 700;

  @media (max-width: ${(props) => props.theme.breakpointMd}) {
    font-size: 1.2em;
  }
`;

const ActionHeadline = styled.h1`
  hyphens: auto;
  margin-bottom: 2rem;

  @media (max-width: ${(props) => props.theme.breakpointMd}) {
    font-size: 1.75em;
  }
`;

const ActionNumber = styled.span`
  font-size: 3.5rem;
  @media (max-width: ${(props) => props.theme.breakpointMd}) {
    font-size: 2.5rem;
  }
`;

const CategoryBadge = styled(Badge)`
  margin-right: 1em;
  padding: .5rem;
  white-space: normal;
  text-align: left;
  font-size: 1rem;
  line-height: 1.1;
  border-radius: ${(props) => props.theme.btnBorderRadius};
  color: ${(props) => props.theme.themeColors.light};
  background-color: ${(props) => props.theme.brandDark};
`;

function ActionHero(props) {
  const {
    t,
    theme,
    categories,
    previousAction,
    nextAction,
    identifier,
    name,
    imageUrl,
  } = props;

  return (
    <Hero>
      <ActionBgImage
        bgImage={imageUrl}
        bgColor={theme.imageOverlay}
      >
        <OverlayContainer>
          <Container>
            <Row>
              <Col md="10">
                <ActionsNav aria-label="Actions Pager">
                  <ActionListLink>
                    <a href>
                      <IndexLink>{ t('actions') }</IndexLink>
                    </a>
                  </ActionListLink>
                  <p>
                    { previousAction
                      && (
                        <ActionLink action={previousAction}>
                          <a href>
                            <Icon name="arrowLeft" color={theme.brandLight} aria-hidden="true" />
                            {' '}
                            { t('previous') }
                          </a>
                        </ActionLink>
                      )}
                    { nextAction
                      && previousAction
                      && (
                        <NavDivider />
                      )}
                    { nextAction
                      && (
                        <ActionLink action={nextAction}>
                          <a href>
                            { t('next') }
                            <Icon name="arrowRight" color={theme.brandLight} aria-hidden="true" />
                          </a>
                        </ActionLink>
                      )}
                  </p>
                </ActionsNav>
                <ActionHeadline>
                  <ActionNumber>{identifier}</ActionNumber>
                  <br />
                  {name}
                </ActionHeadline>
                <VisuallyHidden>Categories:</VisuallyHidden>
                {categories.map((item) => (
                  <CategoryBadge key={item.id} className="mr-3">{item.name}</CategoryBadge>
                ))}
              </Col>
            </Row>
          </Container>
        </OverlayContainer>
      </ActionBgImage>
    </Hero>
  );
}

export default withTranslation('common')(withTheme(ActionHero));