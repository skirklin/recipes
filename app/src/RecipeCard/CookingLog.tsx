import { CheckCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Modal, Popconfirm, message } from 'antd';
import { Context } from '../context';
import { getAppUserFromState, getRecipeFromState, getUserFromState } from '../state';
import { RecipeCardProps } from './RecipeCard';
import { CookingLogEntry } from '../types';
import { updateCookingLogEntry, deleteCookingLogEntry } from '../firestore';

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

const LogEntryContainer = styled.div`
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

const LogActions = styled.div`
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
`

const ActionButton = styled(Button)`
  padding: 0 var(--space-xs);
  height: auto;
  font-size: var(--font-size-sm);
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  const recipe = getRecipeFromState(state, boxId, recipeId);
  const currentUser = getAppUserFromState(state);

  if (!recipe) {
    return null;
  }

  const cookingLog = recipe.cookingLog || [];

  const getUserName = (userId: string): string => {
    const logUser = getUserFromState(state, userId);
    return logUser?.name || 'Someone';
  };

  const canEdit = (entry: CookingLogEntry): boolean => {
    // User can edit their own entries
    return currentUser?.id === entry.madeBy;
  };

  const handleEditClick = (index: number, entry: CookingLogEntry) => {
    // Convert from reversed display index to actual array index
    const actualIndex = cookingLog.length - 1 - index;
    setEditingIndex(actualIndex);
    setEditNote(entry.note || '');
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;

    setSaving(true);
    try {
      await updateCookingLogEntry(boxId, recipeId, editingIndex, editNote);
      message.success('Note updated');
      setEditingIndex(null);
      setEditNote('');
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (displayIndex: number) => {
    // Convert from reversed display index to actual array index
    const actualIndex = cookingLog.length - 1 - displayIndex;
    try {
      await deleteCookingLogEntry(boxId, recipeId, actualIndex);
      message.success('Entry deleted');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      message.error('Failed to delete entry');
    }
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
        {[...cookingLog].reverse().map((entry: CookingLogEntry, displayIndex: number) => (
          <LogEntryContainer key={displayIndex}>
            <LogIcon><CheckCircleOutlined /></LogIcon>
            <LogContent>
              <LogMeta>
                {getUserName(entry.madeBy)} made this on {formatDate(entry.madeAt)}
              </LogMeta>
              {entry.note && <LogNote>"{entry.note}"</LogNote>}
            </LogContent>
            {canEdit(entry) && (
              <LogActions>
                <ActionButton
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(displayIndex, entry)}
                />
                <Popconfirm
                  title="Delete this entry?"
                  onConfirm={() => handleDelete(displayIndex)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <ActionButton
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </LogActions>
            )}
          </LogEntryContainer>
        ))}
      </LogList>

      <Modal
        title="Edit Note"
        open={editingIndex !== null}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditingIndex(null);
          setEditNote('');
        }}
        confirmLoading={saving}
        okText="Save"
      >
        <Input.TextArea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          placeholder="Add a note about how it turned out..."
          rows={3}
          autoFocus
        />
      </Modal>
    </LogContainer>
  );
}

export default CookingLog;
