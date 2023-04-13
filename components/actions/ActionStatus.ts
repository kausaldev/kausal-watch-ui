import React from 'react';
import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components';
import { Progress } from 'reactstrap';
import { getStatusColorFromPlan } from 'common/preprocess';
import { ActionStatusSummaryIdentifier, Plan } from './__generated__/graphql';

const Status = styled.div`
  color: ${(props) => props.theme.themeColors.black};
`;

const StatusTitle = styled.div`
  padding: 3px 6px;
  text-align: left;
  background-color: ${(props) => props.theme.themeColors.light};
  font-size: ${(props) => props.theme.fontSizeSm};
  font-family: ${(props) => props.theme.fontFamilyTiny};
  line-height: ${(props) => props.theme.spaces.s150};
`;

const ActionProgress = styled(Progress)`
  position: relative;
  height: ${(props) => props.theme.spaces.s050};
  background-color: ${(props) => props.color};

  .progress-bar {
    background-color: ${(props) => props.theme.graphColors.green090};
    color: ${(props) => props.theme.themeColors.black};
  }
`;

interface ActionStatusProps {
  plan: Plan;
  statusSummaryIdentifier: ActionStatusSummaryIdentifier;
  completion?: number;
}

function ActionStatus(props: ActionStatusProps) {
  const { plan, statusSummaryIdentifier, completion } = props;
  const theme = useTheme();
  const statusColor = getStatusColorFromPlan(statusSummaryIdentifier, plan, theme);

  return (
    <Status theme={theme}>
      <ActionProgress
        value={completion}
        color={statusColor}
        aria-hidden
      />
      <StatusTitle>
        { statusName }
      </StatusTitle>
    </Status>
  );
}

ActionStatus.defaultProps = {
  identifier: 'not_started',
  name: '',
  completion: 0,
};

export default ActionStatus;
