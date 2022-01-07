import { DownloadOutlined } from '@ant-design/icons';
import { ActionButton } from '../StyledComponents';
import { RecipeType } from '../types';

interface DownloadProps {
  recipe: RecipeType
}

function DownloadButton(props: DownloadProps) {
  const { recipe } = props;

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

  function download() {
    const downloadLink = document.createElement("a");
    downloadLink.download = recipe!.data.name + ".json"
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
  return <ActionButton title="Download recipe" icon={<DownloadOutlined />} disabled={!recipe} onClick={download} />
}

export default DownloadButton;