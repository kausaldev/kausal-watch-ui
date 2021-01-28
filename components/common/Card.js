import React from 'react';
import PropTypes from 'prop-types';
import {
  Card as BSCard, CardBody,
} from 'reactstrap';
import styled from 'styled-components';
import { transparentize } from 'polished';
import { Spring } from 'react-spring/renderprops.cjs';

const StyledCard = styled(BSCard)`
  width: 100%;
  transition: all 0.5s ease;
  overflow: hidden;
  border-width: ${(props) => props.theme.cardBorderWidth};
  border-radius: ${(props) => props.theme.cardBorderRadius};
  background-color: ${(props) => (props.customColor ? props.customColor : props.theme.themeColors.white)};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 4px 4px 8px ${(props) => transparentize(0.8, props.theme.themeColors.dark)};
  }

  &.negative {
    color: ${(props) => props.theme.themeColors.white};
    background-color: ${(props) => (props.customColor ? props.customColor : props.theme.themeColors.black)};

    h1, h2, h3, h4, h5, h6 {
      color: ${(props) => props.theme.themeColors.white};
    }
  }
`;

const ImgArea = styled.div`
  position: relative;
  background-color: ${(props) => (props.imageTone ? props.theme.imageOverlay : props.theme.themeColors.white)};
`;

const ImgBg = styled.div`
  height: 9rem;
  background-image: url(${(props) => props.background});
  background-position: center;
  background-size: cover;
  mix-blend-mode: multiply;

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    height: 8rem;
  }
`;

const Card = (props) => {
  const {
    imageUrl,
    imageTone,
    negative,
    customColor,
    children } = props;

  return (
    <Spring
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
    >
      {(springProps) => (
        <StyledCard
          style={springProps}
          className={negative && 'negative'}
          customColor={customColor}
        >
          {imageUrl && (
            <ImgArea imageTone={imageTone}>
              <ImgBg background={imageUrl} />
            </ImgArea>
          )}
          <CardBody>
            { children }
          </CardBody>
        </StyledCard>
      )}
    </Spring>
  );
};

Card.defaultProps = {
  imageUrl: '',
  imageTone: true,
  negative: false,
  customColor: '',
};

Card.propTypes = {
  imageUrl: PropTypes.string,
  imageTone: PropTypes.bool,
  negative: PropTypes.bool,
  customColor: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default Card;