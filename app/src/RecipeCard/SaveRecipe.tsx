import { useContext } from 'react';
import styled from 'styled-components';

import { RecipeContext } from './context';

const StyledButton = styled.button`
  background-color: green;
  display: inline-flex;
`

function SaveButton() {
  const { state } = useContext(RecipeContext);
  let recipe = state.recipe;
  let textFile: string | null;

  function makeTextFile(text: string) {
    var data = new Blob([text], { type: 'application/ld+json' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

  function save() {
    var downloadLink = document.createElement("a");
    downloadLink.download = recipe.name + ".json"
    downloadLink.innerHTML = "Download File";

    // Create a "file" to download
    downloadLink.href = makeTextFile(JSON.stringify(recipe, null, 2))
    document.body.appendChild(downloadLink);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      downloadLink.dispatchEvent(event); // synthetically click on it
      document.body.removeChild(downloadLink);
    });

  }

  if (state.changed) {
    return <StyledButton onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;