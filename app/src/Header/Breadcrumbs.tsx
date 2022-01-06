import { Breadcrumb } from 'antd';
import { useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Context } from '../context';
import './Header.css';

function Breadcrumbs() {
  const location = useLocation();
  let params = useParams();
  const { state } = useContext(Context);

  let partMap = new Map<string, string>()
  const { boxId, recipeId } = params;
  if (boxId !== undefined) {
    let box = state.boxes.get(boxId)
    if (box !== undefined) {
      partMap.set(boxId, box.data.name)

      if (recipeId !== undefined) {
        let recipe = box.data.recipes.get(recipeId)
        if (recipe !== undefined) {
          let rname = recipe.data.name === undefined ? "" : recipe.data.name.toString()
          partMap.set(recipeId, rname)

        }
      }
    }
  }

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
      <Link  to="/">Recipe box</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);


  return <Breadcrumb className="recipes-breadcrumb" >{breadcrumbItems}</Breadcrumb>
}

export default Breadcrumbs;