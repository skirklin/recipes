import { useContext } from 'react';
import styled from 'styled-components';
import { Recipe } from 'schema-dts';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { RecipeBoxContext } from './constants';

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
    const { dispatch } = useContext(RecipeBoxContext)

    const dummyRequest = (options: any) => {
        console.log("dummyRequest", options)
        if( options.file.type === "application/json") {
            // these are called asynchronously, so this is always just setting it to the latest one. Need to useReducer instead.
            options.file.text().then(JSON.parse).then((r: Recipe) => dispatch({type: "ADD_RECIPE", recipe: r}))
        }
    };


    let title = <Title>Recipe box</Title>
    return (
        <Container>
            {title}
            <Upload directory multiple customRequest={dummyRequest} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Directory</Button>
            </Upload>
            <label>Search: </label>
            <input type="text" />
        </Container >
    );
}

export default Header;
