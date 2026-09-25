import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source for pdfjs from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

export const extractPdfText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const typedArray = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument(typedArray);
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
};
