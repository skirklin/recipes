import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styled from 'styled-components';
import { RecipeType } from '../types';

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`

interface DownloadProps {
  recipe: RecipeType
}

function DownloadButton(props: DownloadProps) {
  let { recipe } = props;

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

  function download() {
    var downloadLink = document.createElement("a");
    downloadLink.download = recipe!.data.name + ".json"
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
  return <StyledButton title="Download recipe" icon={<DownloadOutlined />} disabled={!recipe} onClick={download} />
}

export default DownloadButton;