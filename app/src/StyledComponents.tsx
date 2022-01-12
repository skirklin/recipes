import { Button } from "antd";
import styled from "styled-components";

export const Title = styled.h1`
  font-size: 2em;
  outline: none;
  display: inline;
  padding-left: 5px;
  margin-bottom: 0px;
`

export const ActionButton = styled(Button)`
  &:hover {
    color: var(--selective-yellow);
    border-color: var(--selective-yellow);
  }
  &:focus {
    color: var(--selective-yellow);
    border-color: var(--selective-yellow);
  }
`

export const RecipeActionGroup = styled.div`
  display: inline-block;
  margin-left: auto;
  margin-right: 3px;
  margin-top: 3px;
  margin-bottom: 3px;
`

export const IndexCardLine = styled.hr`
  background-color: var(--cinnabar);
  border-width: 0px;
  height: 1px;
`