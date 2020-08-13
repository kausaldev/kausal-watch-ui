import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import parse, { domToReact } from 'html-react-parser';

import PlanContext from '../../context/plan';

export default function RichText({ html }) {
  const plan = useContext(PlanContext);

  const options = {
    replace: (domNode) => {
      const {
        type, name, attribs, children,
      } = domNode;
      if (type !== 'tag') return null;
      // Rewrite <a> tags to point to the FQDN
      if (name === 'a') {
        if (attribs['data-link-type']) {
          // FIXME: Add icon based on attribs['data-file-extension']
          return <a href={`${plan.serveFileBaseUrl}${attribs.href}`}>{domToReact(children, options)}</a>;
        }
      } else if (name === 'img') {
        if (attribs.src && attribs.src[0] === '/') {
          return <img {...attribs} width={undefined} height={undefined} src={`${plan.serveFileBaseUrl}${attribs.src}`} />;
        }
      }
      return null;
    },
  };

  return <div>{parse(html, options)}</div>;
}