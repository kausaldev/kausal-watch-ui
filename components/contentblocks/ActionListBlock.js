import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';

import { getActionTermContext, useTranslation } from 'common/i18n';
import ActionCard from 'components/actions/ActionCard';
import ActionCardList from 'components/actions/ActionCardList';
import ContentLoader from 'components/common/ContentLoader';
import ErrorMessage from 'components/common/ErrorMessage';
import PlanContext from 'context/plan';

const GET_ACTION_LIST_FOR_BLOCK = gql`
query GetActionListForBlock($plan: ID!, $category: ID) {
  planActions(plan: $plan, category: $category) {
    ...ActionCard
  }
}
${ActionCard.fragments.action}
`;

const ActionListSection = styled.div`
  background-color: ${(props) => props.color};
  padding: ${(props) => props.theme.spaces.s600} 0 ${(props) => props.theme.spaces.s600};
`;

const SectionHeader = styled.h2`
  text-align: center;
  padding: ${(props) => props.theme.spaces.s100};
  border-radius: ${(props) => props.theme.cardBorderRadius};
  background-color: ${(props) => props.theme.themeColors.white};
  color: ${(props) => props.theme.headingsColor};
  margin-bottom: ${(props) => props.theme.spaces.s300};
`;

const ActionListBlock = (props) => {
  const { categoryId, color } = props;
  const { t } = useTranslation();
  const plan = useContext(PlanContext);
  const { loading, error, data } = useQuery(GET_ACTION_LIST_FOR_BLOCK, {
    variables: {
      plan: plan.identifier,
      category: categoryId,
    },
  });
  if (loading) return <ContentLoader />;
  if (error) return <ErrorMessage message={error.message} />;

  const { planActions } = data;
  if (!planActions) {
    return <ErrorMessage statusCode={404} message={t('page-not-found')} />;
  }
  const actions = planActions.map((act) => ({ ...act, iconSvgUrl: act.categories.find((cat) => cat.iconSvgUrl)?.iconSvgUrl }));
  const groupBy = plan.primaryOrgs.length > 0 ? 'primaryOrg' : 'none';

  const heading = t('actions', getActionTermContext(plan));
  return (
    <ActionListSection color={color}>
      <Container>
        { heading && (<SectionHeader>{ heading }</SectionHeader>)}
        <Row>
          <ActionCardList
            actions={actions}
            groupBy={groupBy}
          />
        </Row>
      </Container>
    </ActionListSection>
  );
};

ActionListBlock.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

export default ActionListBlock;
