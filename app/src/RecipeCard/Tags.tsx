import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';
import { getAuth } from 'firebase/auth';
import { useContext, useState } from 'react';
import { Recipe } from 'schema-dts';
import styled from 'styled-components';
import { Context } from '../context';
import { getRecipeFromState } from '../utils';
import { RecipeCardProps } from './RecipeCard';

const TagsArea = styled.div`
  display: inline-block;
  float: right;
`

function Tags(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const [editableTag, setEditableTag] = useState<number>();
  const [inputValue, setInputValue] = useState("");
  const { state, dispatch } = useContext(Context);

  const recipe = getRecipeFromState(state, boxId, recipeId)
  const rd = recipe ? (recipe.changed ? recipe.changed : recipe.data) : { recipeCategory: [] }
  const tags = Array.prototype.filter.call(rd.recipeCategory, x => true)

  if (recipe === undefined) { return null }

  function setTags(tags: string[]) {
    dispatch({ type: "SET_CATEGORIES", recipeId, boxId, payload: tags as Recipe["recipeCategory"] })
  }

  const user = getAuth().currentUser;
  const editable = !!(state.writeable && user && recipe && recipe.owners.includes(user.uid))

  function onClose(idx: number) {
    const newTags = Array.prototype.filter.call(tags, (t, tidx) => idx !== tidx);
    setTags(newTags);
  }

  function confirmEdits(idx: number) {
    const newTags = [...tags];
    newTags[idx] = inputValue;
    setTags(newTags);
    setEditableTag(undefined);
  }

  function newTag() {
    const newTags = [...tags, ""];
    setTags(newTags);
    setInputValue("");
    setEditableTag(newTags.length - 1);
  }

  function formatTags(tags: string[]) {
    if (tags === undefined)
      return null;
    const elts = Array.prototype.map.call(tags,
      (rc, idx) => {
        if (editable && idx === editableTag) {
          return (
            <Input
              autoFocus
              size="small"
              value={inputValue}
              style={{ display: 'inline', width: "fit-content" }}
              onChange={e => setInputValue(e.target.value)}
              onBlur={() => confirmEdits(idx)}
              onPressEnter={() => confirmEdits(idx)} />
          );
        } else {
          return (
            <Tag
              closable={editable}
              onClose={() => onClose(idx)}
              onDoubleClick={() => { setInputValue(rc); setEditableTag(idx); }}
              visible
            >
              {rc}
            </Tag>
          );
        }
      }
    );
    if (editable && editableTag === undefined) {
      elts.push(<Tag style={{ borderStyle: "dashed", backgroundColor: "transparent" }} onClick={() => newTag()}><PlusOutlined />new tag</Tag>);
    }
    return elts;
  }

  return (
    <TagsArea>
      {formatTags(Array.prototype.filter.call(tags, x => true))}
    </TagsArea>
  )
}

export default Tags;