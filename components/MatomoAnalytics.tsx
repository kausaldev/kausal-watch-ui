'use client';

import { stripSlashes } from '@/utils/urls';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

type Props = {
  // Formatted as '<matomoUrl>?<matomoSiteId>'
  matomoAnalyticsUrl?: string;
};

// Matomo analytics events
declare global {
  interface Window {
    _paq?: { push: (...args: unknown[]) => unknown };
  }
}

/**
 * Generated by Matomo, initial trackPageView removed to be handled by the component useEffect
 */
const getTrackingScript = (matomoUrl: string, matomoId: string) => `
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['disableCookies']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="${stripSlashes(matomoUrl, { trailing: true })}/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '${matomoId}']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
`;

function getMatomoConfig(matomoAnalyticsUrl?: string) {
  if (matomoAnalyticsUrl) {
    const [matomoURL, matomoSiteId] = matomoAnalyticsUrl.split('?');

    if (matomoURL && matomoSiteId) {
      return { matomoURL, matomoSiteId };
    }
  }

  return null;
}

export function trackSearch(
  query: string,
  isSearchingOtherPlans: boolean,
  results: number
) {
  if (!window._paq) {
    return;
  }

  // https://developer.matomo.org/guides/tracking-javascript-guide#internal-search-tracking
  window._paq.push([
    'trackSiteSearch',
    // Search keyword searched for
    query,
    // Search category selected in your search engine. If you do not need this, set to false
    isSearchingOtherPlans ? 'Other plans' : false,
    // Number of results in the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
    results,
  ]);
}

export function MatomoAnalytics({ matomoAnalyticsUrl }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  const config = getMatomoConfig(matomoAnalyticsUrl);
  const url = `${pathname}${searchParams ? `?${searchParams}` : ''}`;

  useEffect(() => {
    if (!window._paq) {
      return;
    }

    window._paq.push(['setCustomUrl', url]);
    window._paq.push(['setDocumentTitle', document.title]);
    window._paq.push(['trackPageView']);
  }, [url]);

  if (!config) {
    return null;
  }

  return (
    <Script id="matomo-analytics">
      {getTrackingScript(config.matomoURL, config.matomoSiteId)}
    </Script>
  );
}
