declare const JSZip: any;

export const extractPptxText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  if (typeof JSZip === 'undefined') {
    throw new Error('JSZip library is not loaded. Cannot process presentation files.');
  }

  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideFiles = Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name));

  const slideTexts = await Promise.all(
    slideFiles.map(async (slideFileName) => {
      const slideXml = await zip.file(slideFileName).async('string');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(slideXml, 'application/xml');
      const textNodes = xmlDoc.querySelectorAll('t');
      let text = '';
      textNodes.forEach((node) => {
        text += (node.textContent || '') + ' ';
      });
      return text.trim();
    })
  );

  return slideTexts.filter(Boolean).join('\n\n').trim();
};
