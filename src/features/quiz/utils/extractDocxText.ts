declare const mammoth: any;

export const extractDocxText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  if (typeof mammoth === 'undefined') {
    throw new Error('Mammoth library is not loaded. Cannot process DOCX files.');
  }

  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value || '').trim();
};
