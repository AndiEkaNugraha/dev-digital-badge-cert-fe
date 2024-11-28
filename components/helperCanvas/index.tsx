import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
import axios from 'axios';
import {
   Font,
   getInputFromTemplate,
 } from "@/packages/common";
 import { Form, Viewer, Designer } from '@/packages/ui';
 import { generate } from '@/packages/generator';
 import {
   multiVariableText,
   text,
   barcodes,
   image,
   svg,
   line,
   tableBeta,
   rectangle,
   ellipse,
 } from '@/packages/schemas';
 import plugins from './plugins';
 import {fontObjList} from '@/components/font';
 import { PDFDocument } from "pdf-lib";
 
 export const getFontsData = async () => {
   const fontDataList = (await Promise.all(
     fontObjList.map(async (font) => ({
       ...font,
       data: font.data || (await fetch(font.url || '').then((res) => res.arrayBuffer())),
     }))
   )) as { fallback: boolean; label: string; data: ArrayBuffer }[];
 
   return fontDataList.reduce((acc, font) => ({ ...acc, [font.label]: font }), {} as Font);
 };
 
 export const getPlugins = () => {
   return {
     Text: text,
     'Multi-Variable Text': multiVariableText,
     Table: tableBeta,
     Line: line,
     Rectangle: rectangle,
     Ellipse: ellipse,
     Image: image,
     SVG: svg,
     Signature: plugins.signature,
     QR: barcodes.qrcode,
     JAPANPOST: barcodes.japanpost,
     EAN13: barcodes.ean13,
     EAN8: barcodes.ean8,
     Code39: barcodes.code39,
     Code128: barcodes.code128,
     NW7: barcodes.nw7,
     ITF14: barcodes.itf14,
     UPCA: barcodes.upca,
     UPCE: barcodes.upce,
     GS1DataMatrix: barcodes.gs1datamatrix,
   };
 };
 
 export const generateTemplate = async (currentRef: Designer | Form | Viewer | null, pdfName: string) => {
  if (!currentRef) return;
  const template = currentRef.getTemplate();
  const inputs =
    typeof (currentRef as Viewer | Form).getInputs === 'function'
      ? (currentRef as Viewer | Form).getInputs()
      : getInputFromTemplate(template);
  const font = await getFontsData();

  try {
    const pdf = await generate({
      template:template as any,
      inputs,
      options: {
        font,
        title: pdfName,
      },
      plugins: getPlugins(),
    });

    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const images = await convertPDFBlobToImage(blob);
    return images;
  } catch (e) {
    alert(e + '\n\nCheck the console for full stack trace');
    throw e;
  }
};

export const convertPDFBlobToImage = async (pdfBlob: Blob): Promise<string[]> => {
  const pdfArrayBuffer = await pdfBlob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
  const images: string[] = [];
  if (pdf.numPages === 1) {
    // for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 }); 
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
  
      await page.render(renderContext).promise;
  
      // Menghapus header "data:image/png;base64," untuk mendapatkan string Base64
      const base64Image = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
      images.push(base64Image);
    // }
    return images;
  }
  else {
    console.log('PDF contains more than 1 page');
  }
};

export const generatePDF = async (currentRef: Designer | Form | Viewer | null, pdfName: string) => {
   if (!currentRef) return;
   const template = currentRef.getTemplate();
   const inputs =
     typeof (currentRef as Viewer | Form).getInputs === 'function'
       ? (currentRef as Viewer | Form).getInputs()
       : getInputFromTemplate(template);
   const font = await getFontsData();
 
   try {
     const pdf = await generate({
       template:template as any,
       inputs,
       options: {
         font,
         title: pdfName,
       },
       plugins: getPlugins(),
     });
 
     const blob1 = new Blob([pdf.buffer], { type: 'application/pdf' });
     window.open(URL.createObjectURL(blob1));
      return (true);
   } catch (e) {
     alert(e + '\n\nCheck the console for full stack trace');
     return e;
   }
 };

 export const genearetBundingPDF = async (currentRef: Designer | Form | Viewer | null) => {
  
  if (!currentRef) return;
   const template = currentRef.getTemplate();
   const inputs =
     typeof (currentRef as Viewer | Form).getInputs === 'function'
       ? (currentRef as Viewer | Form).getInputs()
       : getInputFromTemplate(template);
   const font = await getFontsData();
 
   try {
     const pdf = await generate({
       template:template as any,
       inputs,
       options: {
         font,
         title: "pdfName",
       },
       plugins: getPlugins(),
     });
 
     const blob1 = new Blob([pdf.buffer], { type: 'application/pdf' });
     return blob1;
   } catch (e) {
     alert(e + '\n\nCheck the console for full stack trace');
     return e;
   }
 }
 
 export const mergePDFs = async (pdfBlobs) =>{
  try {
    const mergedPdf = await PDFDocument.create();

    for (const blob of pdfBlobs) {
        const existingPdfBytes = await blob.arrayBuffer();

        // Muat PDF dari Blob
        const pdfToMerge = await PDFDocument.load(existingPdfBytes);

        // Salin semua halaman dari PDF yang ada ke PDF yang baru
        const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Buat PDF baru yang digabungkan sebagai Blob
    const mergedPdfBytes = await mergedPdf.save();
    const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    // Tampilkan atau unduh PDF yang telah digabungkan
    // const url = URL.createObjectURL(mergedBlob);
    window.open(URL.createObjectURL(mergedBlob));
  }catch (error) {
    console.error(error);
  }
  
}