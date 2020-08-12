/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Link } from '../routes';

const pathJoin = (...parts) => parts.join('/').replace(/\/+/g, '/');

function getActiveLanguagePath() {
  const {
    i18n: {
      language,
      options: { localeSubpaths },
    },
  } = useTranslation();
  return Object.values(localeSubpaths).includes(language) ? language : '';
}

// react-i18next does not support dynamic routes yet
// DynamicLink adds 'as' property to translated link
// this solution: https://github.com/isaachinman/next-i18next/issues/413#issuecomment-663455809
export function DynamicLink(props) {
  const { as, href, ...other } = props;
  const withAbsolute = href.substr(0, 1) === '/' ? '/' : '';

  return (
    <Link
      {...other}
      href={pathJoin(withAbsolute, getActiveLanguagePath(), href)}
      as={as}
      passHref
    />
  );
}
DynamicLink.propTypes = {
  ...Link.propTypes,
};

// Return true if top level of the current path matches the passed slug
export function isBranchActive(slug) {
  const currentLangPath = getActiveLanguagePath();
  const parentIndex = currentLangPath === '' ? 1 : 2;

  const router = useRouter();
  const splitCurrent = router.asPath.split('/');
  const currentPath = splitCurrent[parentIndex];

  return currentPath === slug;
}

export function getIndicatorLinkProps(id) {
  return {
    href: '/indicators/[id]',
    as: `/indicators/${id}`,
  };
}

export function getActionLinkProps(id) {
  return {
    href: '/actions/[id]',
    as: `/actions/${id}`,
  };
}

export function getActionListLinkProps(query) {
  return {
    href: {
      pathname: '/actions',
      query,
    },
  };
}

export function getDashboardLinkProps(query) {
  return {
    href: {
      pathname: '/dashboard',
      query,
    },
  };
}

export const replaceHashWithoutScrolling = (hash) => window.history.replaceState(
  {}, // state, not used
  '', // title, not used
  hash ? `#${hash}` : `${window.location.pathname}${window.location.search}`,
);

export function IndicatorLink(props) {
  const { id, ...other } = props;

  return (
    <DynamicLink {...getIndicatorLinkProps(id)} passHref {...other} />
  );
}
IndicatorLink.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ...Link.propTypes,
};

export function ActionLink(props) {
  const { action, ...other } = props;
  // If this action is merged with another, replace all links with
  // a link to the master action.
  const targetIdentifier = action.mergedWith ? action.mergedWith.identifier : action.identifier;

  return (
    <DynamicLink {...getActionLinkProps(targetIdentifier)} passHref {...other} />
  );
}
ActionLink.propTypes = {
  action: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    mergedWith: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export function ActionListLink(props) {
  const { query, ...other } = props;
  const pathname = '/actions';
  const href = {
    pathname,
    query,
  };

  return <Link href={href} passHref {...other} />;
}
ActionListLink.propTypes = {
  query: PropTypes.shape({
    organization: PropTypes.string,
  }),
  ...Link.propTypes,
};
ActionListLink.defaultProps = {
  query: null,
};

export function IndicatorListLink(props) {
  return <Link href="/indicators" passHref {...props} />;
}
IndicatorListLink.propTypes = {
  ...Link.propTypes,
};

export function DashboardLink(props) {
  return <Link href="/dashboard" passHref {...props} />;
}
DashboardLink.propTypes = {
  ...Link.propTypes,
};

export function StaticPageLink(props) {
  const { slug, ...other } = props;
  return <Link href="/[slug]" as={`/${slug}`} {...other} />;
}
StaticPageLink.propTypes = {
  slug: PropTypes.string.isRequired,
  ...Link.propTypes,
};

export function NavigationLink(props) {
  const { slug, ...other } = props;
  return <Link href={`/${slug}`} {...other} passHref />;
}

NavigationLink.propTypes = {
  slug: PropTypes.string.isRequired,
  ...Link.propTypes,
};
