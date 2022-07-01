import React, { useContext } from 'react';
import styled, { css } from 'styled-components';

import RichText from 'components/common/RichText';
import PlanContext from 'context/plan';
import Icon from 'components/common/Icon';
import CategoryMetaBar from '../actions/CategoryMetaBar';

const ScaleIcon = styled(Icon)`
  font-size: ${(props) => {
    switch (props.size) {
      case 'sm': return '.8em';
      case 'md': return '1.5em';
      default: return '1.5em';
    }
  }};

  &.icon-on {
    fill: ${(props) => props.theme.brandDark} !important;
  }

  &.icon-off {
    fill: ${(props) => props.theme.themeColors.light} !important;
  }

  &.icon-bad {
    fill: ${(props) => props.theme.graphColors.red070} !important;
  }
`;

const AttributesList = styled.dl`
  ${props => props.vertical && css`
    display: flex;
    flex-flow: row wrap;
  `}
  max-width: 720px;
  margin: ${(props) => props.theme.spaces.s200} auto 0;

  h3 {
    font-size: ${(props) => props.theme.fontSizeBase};
  }

  dt {
    flex: 0 0 100%;
    margin-bottom: .5rem;
  }

  dd {
    flex: 0 1 100%;
    margin-bottom: 1rem;

    .text-content {
      text-align: left;
    }
    .text-content > *:last-child {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    margin: ${(props) => props.theme.spaces.s400} auto 0;

    dt {
      flex: 0 0 30%;
      text-align: right;
    }

    dd {
      flex: 0 1 60%;
      text-align: left;
      padding-left: ${(props) => props.theme.spaces.s150};
    }
  }
`;

const AttributeChoiceLabel = styled.span`
  margin-left: ${(props) => props.theme.spaces.s050};
  font-size: ${(props) => props.theme.fontSizeSm};
`;

const formatEmissionSharePercent = (share, total) => {
  const label = 'av totala utsläppen';
  if (!share) return null;
  const percent = share / total * 100;
  if (percent < 1) return `< 1 % ${label}`;
  return `${Math.round(percent)} % ${label}`;
};

function AttributeContent(props) {
  const { contentData, contentType, title, vertical } = props;

  let dataElement;
  switch (contentData.__typename) {
    case 'AttributeChoice':
      if (contentType) {
        const valueIndex = contentType.choiceOptions.findIndex(
          (choiceType) => choiceType.identifier === contentData.valueIdentifier
        );
        // const choiceCount = contentType.choiceOptions.length;
        dataElement = (
          <div>
            { contentType.choiceOptions.map((choice, idx) => (
              <ScaleIcon
                name="circleFull"
                className={idx <= valueIndex ? 'icon-on' : 'icon-off'}
                size="md"
                key={choice.identifier}
              />
            ))}
            <AttributeChoiceLabel>{ contentData.value }</AttributeChoiceLabel>
          </div>
        );
      }
      break;
    case 'AttributeChoiceAndText':
      // TODO
      return null;
    case 'AttributeRichText':
      dataElement = (
        <RichText html={contentData.value} />
      );
      break;
    case 'AttributeNumericValue':
      dataElement = (
        <span>
          {contentData.numericValue}
        </span>
      );
      break;
    default: return <div />;
  }
  if (vertical) {
    return (
      <>
        <dt>{title}</dt>
        <dd>{dataElement}</dd>
      </>
    );
  }
  // Render horizontal layout
  return (
    <div className="mb-4">
      <h3>{title}</h3>
      {dataElement}
    </div>
  );
}

function AttributesBlock(props) {
  const plan = useContext(PlanContext);
  const {
    attributes,
    children,  // extra children that can be passed by nesting in the JSX tag
    types,
    vertical,
  } = props;

  return (
    <AttributesList vertical={vertical}>
      {attributes.map((item) => (
        <React.Fragment key={item.id}>
          <AttributeContent
            title={item.key}
            contentData={item}
            contentType={types?.find((type) => type.identifier === item.keyIdentifier)}
            vertical={vertical}
          />
        </React.Fragment>
      ))}
      {children}
    </AttributesList>
  );
}

// TODO: prop types and defaults
AttributesBlock.defaultProps = {

};

AttributesBlock.propTypes = {

};

export default AttributesBlock;