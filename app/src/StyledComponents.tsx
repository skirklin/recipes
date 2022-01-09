import { Button } from "antd";
import styled from "styled-components";

export const Title = styled.h1`
  font-size: 2em;
  outline: none;
  display: inline;
  padding: 20px 0px 0px 20px;
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
  float: right;
  margin: 5px;
`

export const IndexCardLine = styled.hr`
  background-color: var(--cinnabar);
  border-width: 0px;
  height: 1px;
`