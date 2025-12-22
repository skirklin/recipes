import { Breadcrumb, Dropdown, Menu } from 'antd';
import { useContext } from 'react';
import { Link, Params, useLocation, useParams } from 'react-router-dom';
import { Context } from '../context';
import { useMediaQuery } from 'react-responsive'

import './Header.css';
import { AppState } from '../types';
import { EllipsisOutlined } from '@ant-design/icons';

function getPartMap(params: Readonly<Params<string>>, state: AppState) {

  const partMap = new Map<string, string>()
  const { boxId, recipeId } = params;
  if (boxId !== undefined) {
    const box = state.boxes.get(boxId)
    if (box !== undefined) {
      partMap.set(boxId, box.getName())

      if (recipeId !== undefined) {
        const recipe = box.recipes.get(recipeId)
        if (recipe !== undefined) {
          partMap.set(recipeId, recipe.getName())
        }
      }
    }
  }
  return partMap
}

function FullBreadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const { state } = useContext(Context);
  const partMap = getPartMap(params, state)

  const pathParts = location.pathname.split('/').filter(i => i);

  const extraBreadcrumbItems = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item className="recipes-breadcrumb" key={url}>
        <Link to={url}>{partMap.get(part) || part}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item className="recipes-breadcrumb" key="home">
      <Link to="/">Recipe box</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return <Breadcrumb className="recipes-breadcrumb" >{breadcrumbItems}</Breadcrumb>
}

function CollapsedBreadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const { state } = useContext(Context);
  const partMap = getPartMap(params, state)
  const pathParts = location.pathname.split('/').filter(i => i);
  const menuItems = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    return (
      <Menu.Item className="recipes-breadcrumb" key={url}>
        <Link to={url}>{partMap.get(part) || part} /</Link>
      </Menu.Item>
    );
  });

  const menu = <Menu>{menuItems}</Menu>

  const breadcrumbItems = [
    <Breadcrumb.Item className="recipes-breadcrumb" key="home">
      <Link to="/">Recipes</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item className="recipes-breadcrumb" key="ellipsis">
      <Dropdown overlay={menu}><EllipsisOutlined /></Dropdown>
    </Breadcrumb.Item>
  ]
  return <Breadcrumb className="recipes-breadcrumb" >{breadcrumbItems}</Breadcrumb>

}

function ResponsiveBreadcrumbs() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  if (isTabletOrMobile) {
    return <CollapsedBreadcrumbs />
  } else {
    return <FullBreadcrumbs />
  }
}

export default ResponsiveBreadcrumbs;
