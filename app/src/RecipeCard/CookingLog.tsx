import { CheckCircleOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../context';
import { getRecipeFromState, getUserFromState } from '../state';
import { RecipeCardProps } from './RecipeCard';
import { CookingLogEntry } from '../types';

const LogContainer = styled.div`
  margin-top: var(--space-md);
`

const LogTitle = styled.h3`
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--space-sm) 0;
`

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

const LogEntry = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-bg-subtle);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
`

const LogIcon = styled.span`
  color: var(--color-primary);
  flex-shrink: 0;
`

const LogContent = styled.div`
  flex: 1;
`

const LogMeta = styled.div`
  color: var(--color-text-secondary);
`

const LogNote = styled.p`
  margin: var(--space-xs) 0 0 0;
  color: var(--color-text);
  font-style: italic;
`

const EmptyState = styled.div`
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-style: italic;
`

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function CookingLog(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const { state } = useContext(Context);

  const recipe = getRecipeFromState(state, boxId, recipeId);

  if (!recipe) {
    return null;
  }

  const cookingLog = recipe.cookingLog || [];

  const getUserName = (userId: string): string => {
    const logUser = getUserFromState(state, userId);
    return logUser?.name || 'Someone';
  };

  if (cookingLog.length === 0) {
    return (
      <LogContainer>
        <LogTitle>Cooking Log</LogTitle>
        <EmptyState>No entries yet. Click "I made it!" after you cook this recipe.</EmptyState>
      </LogContainer>
    );
  }

  return (
    <LogContainer>
      <LogTitle>Cooking Log</LogTitle>
      <LogList>
        {[...cookingLog].reverse().map((entry: CookingLogEntry, idx: number) => (
          <LogEntry key={idx}>
            <LogIcon><CheckCircleOutlined /></LogIcon>
            <LogContent>
              <LogMeta>
                {getUserName(entry.madeBy)} made this on {formatDate(entry.madeAt)}
              </LogMeta>
              {entry.note && <LogNote>"{entry.note}"</LogNote>}
            </LogContent>
          </LogEntry>
        ))}
      </LogList>
    </LogContainer>
  );
}

export default CookingLog;
