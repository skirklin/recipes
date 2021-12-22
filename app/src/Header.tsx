import { ChangeEvent, useContext } from 'react';
import styled from 'styled-components';
import { Recipe } from 'schema-dts';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { RecipeBoxContext } from './context';

const Container = styled.div`
  background-color: transparent;
  border-bottom: solid;
  padding: 10px;
`

const Title = styled.h1`
  margin: 0px;
  margin-bottom: 20px;
  display: inline-block;
`

function Header() {
    const { dispatch, state } = useContext(RecipeBoxContext)
    const { recipes } = state;

    const dummyRequest = (options: any) => {
        if (options.file.type === "application/json") {
            options.file.text().then(JSON.parse).then((r: Recipe) => dispatch({ type: "ADD_RECIPE", recipe: r }))
        }
    };

    function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
        function filterFunc(value: Recipe): boolean {
            let re = new RegExp(event.target.value.toLowerCase())
            if (value!.name!.toString().toLowerCase().match(re) !== null) {
                return true
            }

            let matches = Array.prototype.filter.call(value.recipeIngredient, ri => ri.toString().toLowerCase().match(re))
            if (matches.length > 0) {
                return true
            }

            matches = Array.prototype.filter.call(value.recipeInstructions, ri => ri.text!.toString().toLowerCase().match(re))
            if (matches.length > 0) {
                return true
            }

        return false
    }
    let searchResult = recipes.filter(filterFunc)
    dispatch({ type: "SET_SEARCH_RESULT", searchResult })
}
let title = <Title>Recipe box</Title>
return (
    <Container>
        {title}
        <Upload directory multiple customRequest={dummyRequest} showUploadList={false}>
            <Button style={{ float: "right", display: "inline-block" }} icon={<UploadOutlined />}>Upload Directory</Button>
        </Upload>
        <label>Search: </label>
        <input type="text" onChange={handleSearch} />
    </Container >
);
}

export default Header;
