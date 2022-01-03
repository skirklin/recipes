import { useContext } from "react";
import { RecipeContext } from "./context";

export default function Image() {

  const { state } = useContext(RecipeContext);
  if (state.recipe === undefined) {
    return null
  }
  let image = state.recipe.data.image;

  if (image === undefined) {
    return null
  }
  if (image instanceof String) {
    return <img src={image.toString()} alt="original" />
  } else {
    // not sure why ImageObject doesn't think url is a valid propery, according to schema.org it inherits it from Thing and should be an option.
    /* @ts-expect-error */
    if (image.url !== undefined) {
      /* @ts-expect-error */
      return <img src={image.url.toString()} alt="original" style={{ maxWidth: "30%", padding: "15px", float: "right" }} />
    }
  }
  return null
}