import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col,
} from 'reactstrap';

import SVG from 'react-inlinesvg';
import styled, { withTheme } from 'styled-components';
import { withTranslation } from '../../common/i18n';
import { NavigationLink } from '../../common/links';

const StyledFooter = styled.footer`
  position: relative;
  min-height: 14em;
  clear: both;
  background-color: ${(props) => props.theme.neutralDark};
  color: ${(props) => props.theme.themeColors.white};
  padding: 6rem 0;
 
  a {
      color: ${(props) => props.theme.themeColors.white};

      &:hover {
        color: ${(props) => props.theme.themeColors.white};
        text-decoration: underline;
      }
    }
`;

const Logo = styled.div`
  height: ${(props) => props.theme.spaces.s400};
  width: calc( 4 * ${(props) => props.theme.spaces.s300});
  margin-bottom: ${(props) => props.theme.spaces.s150};

  svg {
    height: 100%;
    width: 100%;
  }
`;

const ServiceTitle = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.s200};
  font-size: ${(props) => props.theme.fontSizeMd};
  font-weight: ${(props) => props.theme.fontWeightBold};
`;

const OrgTitle = styled.div`
  font-size: ${(props) => props.theme.fontSizeBase};
  font-weight: ${(props) => props.theme.fontWeightNormal};
`;

const FooterNav = styled.nav`
    line-height: ${(props) => props.theme.lineHeightSm};
`;

const FooterNavItems = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
`;

const FooterNavItem = styled.li`
  width: 25%;
  padding-right: ${(props) => props.theme.spaces.s150};
  margin-bottom: ${(props) => props.theme.spaces.s300};
  font-size: ${(props) => props.theme.fontSizeBase};
  
  .parent-item {
    font-weight: ${(props) => props.theme.fontWeightBold};
  }
`;

const FooterSubnav = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterNavSubItem = styled.li`
  margin-top: ${(props) => props.theme.spaces.s100};
  font-size: ${(props) => props.theme.fontSizeBase};
  font-weight: ${(props) => props.theme.fontWeightNormal};
`;

const Divider = styled.hr`
  border-top: 2px solid ${(props) => props.theme.themeColors.white};
`;

const SmallPrint = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SmallPrintSection = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

const SmallPrintItem = styled.li`
  margin-left: ${(props) => props.theme.spaces.s050};
  &:before {
    content: "\\2022";
    margin-right: ${(props) => props.theme.spaces.s050};
  }

  &:first-child {
    margin-left: 0;

    &:before {
      content: "";
      margin-right: 0;
    }
  }
`;

function SiteFooter(props) {
  const {
    t,
    theme,
    siteTitle,
    ownerUrl,
    ownerName,
    creativeCommonsLicense,
    copyrightText,
    navItems,
  } = props;

  const OrgLogo = () => <SVG src={theme.themeLogoUrl} preserveAspectRatio="xMinYMin meet" />;

  return (
    <>
      <StyledFooter className="site-footer">
        <Container>
          <Row>
            <Col md="4">
              <Logo>
                <a href={ownerUrl}>
                  <OrgLogo aria-hidden="true" className="footer-org-logo" />
                </a>
              </Logo>
              <ServiceTitle>
                {siteTitle}
              </ServiceTitle>
              <OrgTitle>
                <a href={ownerUrl} target="_blank">
                  {ownerName}
                </a>
              </OrgTitle>
              <div className="funding-instrument-logo-container">
                <div className="funding-instrument-logo" />
              </div>
            </Col>
            <Col md="8">
              <FooterNav>
                <FooterNavItems>
                  { navItems && navItems.map((page) => (
                    <FooterNavItem key={page.id}>
                      <NavigationLink slug={page.slug}>
                        <a className="parent-item">{page.name}</a>
                      </NavigationLink>
                      { page.children && (
                        <FooterSubnav>
                          { page.children.map((childPage) => (
                            <FooterNavSubItem key={childPage.slug}>
                              <NavigationLink slug={childPage.slug}>
                                <a>{childPage.name}</a>
                              </NavigationLink>
                            </FooterNavSubItem>
                          ))}
                        </FooterSubnav>
                      )}
                    </FooterNavItem>
                  ))}
                </FooterNavItems>
              </FooterNav>
            </Col>

          </Row>
          <Row>
            <Col>
              <Divider />
              <SmallPrint>
                <SmallPrintSection>
                  <SmallPrintItem>{creativeCommonsLicense}</SmallPrintItem>
                  <SmallPrintItem>{copyrightText}</SmallPrintItem>
                  <SmallPrintItem><a href="#">Terms & Conditions</a></SmallPrintItem>
                  <SmallPrintItem><a href="#">Accessibility</a></SmallPrintItem>
                </SmallPrintSection>
                <SmallPrintSection>
                  <SmallPrintItem><a href="#">Give Feedback</a></SmallPrintItem>
                </SmallPrintSection>
              </SmallPrint>
            </Col>
          </Row>
        </Container>
      </StyledFooter>
    </>
  );
}

SiteFooter.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.shape({}).isRequired,
  ownerUrl: PropTypes.string.isRequired,
  ownerName: PropTypes.string.isRequired,
  creativeCommonsLicense: PropTypes.string.isRequired,
  copyrightText: PropTypes.string.isRequired,
  navItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default withTranslation('common')(withTheme(SiteFooter));
