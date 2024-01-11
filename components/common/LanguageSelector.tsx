import { useLocale } from 'next-intl';
import { Link } from 'common/links';
import styled from 'styled-components';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Icon from './Icon';
import { useTheme } from 'styled-components';
import { PlanContextFragment } from '@/common/__generated__/graphql';
import { usePlan } from '@/context/plan';

const Selector = styled(UncontrolledDropdown)<{ $mobile: boolean }>`
  a {
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 0 ${(props) => props.theme.spaces.s050}
      ${(props) => props.theme.spaces.s100};
    color: ${(props) => props.theme.neutralDark};

    &:hover {
      text-decoration: none;
      color: ${(props) => props.theme.neutralDark};

      .highlighter {
        border-bottom: 5px solid ${(props) => props.theme.brandDark};
      }
    }

    @media (min-width: ${(props) => props.theme.breakpointMd}) {
      align-self: center;
      margin: 0;
    }
  }

  svg {
    fill: ${(props) =>
      props.$mobile
        ? props.theme.themeColors.dark
        : props.theme.brandNavColor} !important;
  }
`;

const StyledDropdownToggle = styled(DropdownToggle)`
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 !important;
  text-decoration: none;
  background: none;
  border: none;

  svg.icon {
    fill: ${(props) => props.theme.themeColors.dark} !important;
  }

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    align-self: center;
    margin: 0;

    svg.icon {
      fill: ${(props) => props.theme.brandNavColor} !important;
    }
  }
`;

const CurrentLanguage = styled.span<{ $mobile: boolean }>`
  display: inline-block;
  width: 1.5rem;
  margin: 0;
  text-transform: uppercase;
  font-size: 90%;
  color: ${(props) =>
    props.$mobile ? props.theme.themeColors.dark : props.theme.brandNavColor};
`;

const StyledDropdownMenu = styled(DropdownMenu)`
  right: 0;
`;

// For now, we only show language names without variants (e.g., "English" instead of "English (Australia)" as it's
// arguably unlikely that a site uses two variants of the same base language.
const languageNames = {
  fi: 'Suomi',
  en: 'English',
  de: 'Deutsch',
  sv: 'Svenska',
  es: 'Español',
  da: 'Dansk',
};

function getLocales(plan: PlanContextFragment) {
  return [plan.primaryLanguage, ...(plan.otherLanguages ?? [])];
}

const LanguageSelector = (props) => {
  const currentLocale = useLocale();
  const theme = useTheme();
  const plan = usePlan();
  const { mobile } = props;

  const locales = getLocales(plan).filter(
    (locale) => !theme.settings.hiddenLocales?.includes(locale)
  );

  if (locales?.length < 2) return null;
  // Strip language variant (if any)
  const languageCode = currentLocale?.split('-')[0];

  return (
    <Selector inNavbar $mobile={mobile} className={mobile && 'd-md-none'}>
      <StyledDropdownToggle color="link" data-toggle="dropdown" tag="button">
        <Icon name="globe" width="1.25rem" height="1.25rem" />
        <CurrentLanguage $mobile={mobile}>{languageCode}</CurrentLanguage>
      </StyledDropdownToggle>
      <StyledDropdownMenu end>
        {locales.map((locale) => (
          <DropdownItem key={locale} tag="div">
            {/* TODO: Ensure multiplan links are respected */}
            <Link locale={locale} href={`/${locale}`}>
              {languageNames[locale.split('-')[0]]}
            </Link>
          </DropdownItem>
        ))}
      </StyledDropdownMenu>
    </Selector>
  );
};

export default LanguageSelector;
