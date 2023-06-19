import { Given, When, Then } from '@wdio/cucumber-framework';
import PdfDownload from '../pageobjects/DocSumoPDFDownload.page';
const { remote } = require('webdriverio');
// await browser.url('https://www.docsumo.com/free-tools/split-pdf-pagerange');

// async function runExample() {
//     // Create a WebDriverIO browser instance
//     const browser = await remote({
//       capabilities: {
//         browserName: 'chrome',
//       },
//     });

   

Given(/^User is on the DocSumo webpage$/, async () => {
    await PdfDownload.open();
});

When(/^User hovers on Tools$/, async () => {
    await PdfDownload.hoverOnTools();
});

When(/^User selects the option (.*)$/, async (option) => {
    await PdfDownload.clickOnOptions(option)
});

Then(/^User should be navigated to (.*) page$/, async (option) => {
    await PdfDownload.verifyPageLoads(option);
});

When(/^User selects a pdf file to upload$/, async () => {
    await PdfDownload.selectPdfFileToUpload();
});

When(/^The split document should load$/, async () => {
    await PdfDownload.verifySplitDocumentLoads();
});

When(/^User counts the number of pages in the document$/, async () => {
    await PdfDownload.countThePages();
});

When(/^User splits the document$/, async () => {
    await PdfDownload.splitTheDocument();
});

When(/^User clicks on split button$/, async () => {
    await PdfDownload.clickOnSplitPdfButton();
});

Then(/^Zip file should be downloaded$/, async () => {
    await PdfDownload.verifyZipFileDownloaded();
});

When(/^User unzip the downloaded files$/, async () => {
    await PdfDownload.unzipTheDownloadedFile();
});

When(/^Downloaded folder should have same number of documents$/, async () => {
    await PdfDownload.countTheNumberOfDocuments();
});

When(/^Extension of the downloaded files should be pdfs$/, async () => {
    await PdfDownload.verifyExtensionOfDocuments();
});