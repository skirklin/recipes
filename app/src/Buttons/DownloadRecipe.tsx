import { DownloadOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from '../context';
import { RecipeCardProps } from '../RecipeCard/RecipeCard';
import { RecipeEntry } from '../storage';
import { ActionButton } from '../StyledComponents';
import { getRecipeFromState } from '../utils';

function DownloadButton(props: RecipeCardProps) {
  const { state } = useContext(Context)
  const recipe = getRecipeFromState(state, props.boxId, props.recipeId)
  if (recipe === undefined) return null

  let textFile: string | null;

  function makeTextFile(text: string) {
    const data = new Blob([text], { type: 'application/ld+json' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  }

  function download(recipe: RecipeEntry) {
    const downloadLink = document.createElement("a");
    downloadLink.download = recipe.data.name + ".json"
    downloadLink.innerHTML = "Download File";

    // Create a "file" to download
    downloadLink.href = makeTextFile(JSON.stringify(recipe, null, 2))
    document.body.appendChild(downloadLink);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      const event = new MouseEvent('click');
      downloadLink.dispatchEvent(event); // synthetically click on it
      document.body.removeChild(downloadLink);
    });

  }
  return <ActionButton title="Download recipe" icon={<DownloadOutlined />} disabled={!recipe} onClick={() => download(recipe)} />
}

export default DownloadButton;