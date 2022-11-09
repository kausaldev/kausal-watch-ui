import React from 'react';
import PropTypes, { string } from 'prop-types';
import { transparentize } from 'polished';
import styled from 'styled-components';
import { Theme } from 'common/theme';

const Tag = styled.div`
  display: flex;
  align-items: flex-start;
  max-width: 600px;
  border-radius: 4px;
`;

type PlanAvatarProps = {
  size: keyof Theme['spaces'],
}

const PlanAvatar = styled.img<PlanAvatarProps>`
  display: block;
  width: ${(props) => props.theme.spaces[props.size]};
  height: ${(props) => props.theme.spaces[props.size]};
  margin-right: ${(props) => props.size === 's300' ? props.theme.spaces.s050 : props.theme.spaces.s050};
  border-radius: 50%;
  box-shadow: 0 0 3px 1px ${(props) => transparentize(0.8, props.theme.themeColors.black)};
`;

const PlanName = styled.div<{negative?: boolean}>`
  color: ${(props) => props.negative ? props.theme.themeColors.light : props.theme.themeColors.dark};
  line-height: 1.2;
`;

const PlanTitle = styled.div<{size: string, weight: 'fontWeightNormal' | 'fontWeightBold'}>`
  font-size: ${(props) => props.theme[props.size]};
  font-weight: ${(props) => props.theme[props.weight]};
`;

const PlanOrg = styled.div<{negative?: boolean}>`
  font-size: 75%;
  font-weight: ${(props) => props.theme.fontWeightNormal};
  font-family: ${(props) => props.theme.fontFamilyTiny};
  color: ${(props) => props.negative ? props.theme.graphColors.grey030 : props.theme.graphColors.grey060};
`;

type PlanChipProps = {
  planImage?: string,
  planShortName: string,
  organization: string,
  size: 'sm' | 'md' | 'lg',
  negative?: boolean,
}

const IMAGE_SIZES = {
  'sm': 's100',
  'md': 's200',
  'lg': 's300',
}

const FONT_SIZES = {
  'sm': 'fontSizeSm',
  'md': 'fontSizeSm',
  'lg': 'fontSizeMd',
}

const PlanChip = React.forwardRef((props: PlanChipProps, ref) => {
  const {
    planImage,
    planShortName,
    organization,
    size,
    negative
  } = props;

  return (
    <Tag ref={ref} {...props}>
      { planImage && (<PlanAvatar src={planImage} size={IMAGE_SIZES[size]} alt=""/>) }
      <PlanName negative={negative}>
        <PlanTitle
          weight={size==='sm' ? 'fontWeightNormal' : 'fontWeightBold'}
          size={FONT_SIZES[size]}
        >
          {planShortName}
        </PlanTitle>
        <PlanOrg negative={negative}>
          {organization}
        </PlanOrg>
      </PlanName>
    </Tag>
  );
});

PlanChip.displayName = "PlanChip";

PlanChip.defaultProps = {
  size: 'md',
  negative: false,
};

export default PlanChip;