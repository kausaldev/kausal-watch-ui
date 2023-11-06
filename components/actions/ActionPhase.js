import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from 'common/theme';
import { getActionTermContext, useTranslation } from 'common/i18n';
import { getStatusColorForAction } from 'common/ActionStatusSummary';
import { usePlan } from 'context/plan';

const Status = styled.div`
  color: ${(props) => props.theme.themeColors.black};

  &.compact {
    font-size: ${(props) => props.theme.fontSizeSm};
    font-family: ${(props) => props.theme.fontFamilyTiny};
  }

  ul {
    display: flex;
    align-items: flex-end;
    margin-bottom: ${(props) => props.theme.spaces.s050};
    padding: 0;
    list-style-type: none;
  }

  li {
    flex: 1;
    margin-right: 4px;
  }

  .label {
    font-size: ${(props) => props.theme.fontSizeSm};
    font-family: ${(props) => props.theme.fontFamilyTiny};
    line-height: ${(props) => props.theme.lineHeightMd};
    hyphens: manual;
  }
`;

const PhaseReason = styled.p`
  margin-bottom: ${(props) => props.theme.spaces.s050};
  font-size: ${(props) => props.theme.fontSizeSm};
  font-family: ${(props) => props.theme.fontFamilyTiny};
  line-height: ${(props) => props.theme.lineHeightMd};
`;

const PhaseLabel = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.s050};
  font-size: ${(props) => props.theme.fontSizeSm};
  font-family: ${(props) => props.theme.fontFamilyTiny};
  line-height: ${(props) => props.theme.lineHeightMd};
  hyphens: manual;

  &.active {
    font-weight: ${(props) => props.theme.fontWeightBold};
  }

  &.disabled {
    color: ${(props) => props.theme.themeColors.dark};
  }
`;

const PhaseBlock = styled.div`
  position: relative;
  height: ${(props) => props.theme.spaces.s050};
  width: auto;
  background-color: ${(props) => props.theme.themeColors.light};
  border-radius: ${(props) => props.theme.badgeBorderRadius};
  background-color: ${(props) => props.blockColor};
`;

function Phase(props) {
  const { name } = props.phase;
  const { statusSummary, active, passed, compact, plan, action } = props;
  const theme = useTheme();

  let blockColor = theme.themeColors.light;
  const color = statusSummary
    ? getStatusColorForAction(action, plan, theme)
    : theme.graphColors.grey050;

  let labelClass = 'disabled';

  // Passed phase gets active status color
  if (passed) {
    // phaseClass = 'bg-active';
    blockColor = color;
    labelClass = '';
  } else if (active) {
    blockColor = color;
    labelClass = 'active';
  } else if (statusSummary?.isCompleted) {
    blockColor = color;
    labelClass = 'disabled';
  }

  return (
    <li>
      {!compact && <PhaseLabel className={labelClass}>{name}</PhaseLabel>}
      <PhaseBlock blockColor={blockColor} />
    </li>
  );
}

function ActionPhase(props) {
  const { status, activePhase, reason, action, phases, compact, ...rest } =
    props;

  const { t } = useTranslation(['common', 'actions']);
  const plan = usePlan();
  let activePhaseName = activePhase?.name;
  let phaseIndex = -1;

  // Find position of the active phase
  if (activePhase?.identifier) {
    phaseIndex = phases.findIndex(
      (phase) => phase.identifier === activePhase.identifier
    );
  }
  // Override phase name in special case statuses
  const inactive = ['cancelled', 'merged', 'postponed', 'completed'].includes(
    status?.identifier
  );

  if (status && inactive) {
    activePhaseName =
      status.identifier === ActionStatusSummaryIdentifier.Merged
        ? `${t('actions:action-status-merged', getActionTermContext(plan))}`
        : status.label;
  }

  return (
    <Status {...rest} className={compact && 'compact'}>
      <ul>
        {phases.map((phase, indx) => (
          <Phase
            action={action}
            phase={phase}
            plan={plan}
            passed={indx < phaseIndex}
            active={indx === phaseIndex}
            statusSummary={status}
            disabled={inactive}
            key={phase.id}
            compact={compact}
          />
        ))}
      </ul>
      {!compact && !!status && status.identifier !== 'UNDEFINED' && (
        <>
          <strong>{status.label}</strong>
          {reason && (
            <PhaseReason>
              <strong>{t('action-status-reason')}: </strong>
              {reason}
            </PhaseReason>
          )}
        </>
      )}
      {compact && <span>{activePhaseName}</span>}
    </Status>
  );
}

ActionPhase.propTypes = {
  /** If status is undefined, status colors and labels will be hidden */
  status: PropTypes.shape(),
  activePhase: PropTypes.shape(),
  reason: PropTypes.string,
  phases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      identifier: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  compact: PropTypes.bool,
};

ActionPhase.defaultProps = {
  activePhase: {},
  reason: '',
  phases: [],
  compact: false,
};

export default ActionPhase;
