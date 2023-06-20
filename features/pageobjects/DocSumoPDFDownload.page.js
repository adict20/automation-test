import { error } from 'console';
import { stdout } from 'process';
import cucumberJson from 'wdio-cucumberjs-json-reporter';
import { brotliCompress } from 'zlib';
const util = require('util');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const robot = require('robotjs');
const path = require('path');
const assert = require('assert').strict;
let docSumoUrl = "https://www.docsumo.com/";
const AdmZip = require('adm-zip');
let pageCount;
var parentGUID;

class PdfDownload {

    //Locators which could be reused 
    get tools() {
        return $('#w-dropdown-toggle-1');
    }

    get uploadPdfButton() {
        return $('//a[@id = "pdf_button" and @href = "#"]');
    }

    get cookiePopUp() {
        return $('//div[@class = "fs-cc-banner2_component"]');
    }

    get cookieDenyButton() {
        return $('#cookie-deny');
    }

    get splitPdfButton() {
        return $('//button[contains(.,"Split PDF")]');
    }

    //Methods

    async open() {
        await browser.pause();
        await browser.maximizeWindow();
        await browser.url(docSumoUrl);
        cucumberJson.attach("Website is loaded");
        parentGUID = await browser.getWindowHandle();
    }

    async hoverOnTools() {
        //This method is to hover on tools menu
        //Method browser.pause() is used to provide static wait
        await browser.pause(2000);
        await this.tools.waitForExist();
        await this.tools.moveTo();
        await browser.pause(2000);
        cucumberJson.attach("Tools menu is expanded");
    }

    async clickOnOptions(options) {
        // This is to click on options out of all the options present in tools menu.
        //  It takes parameters options, which will allow selecting various options displayed
        await browser.pause(1000);
        let currentOption, currentOptionName;
        currentOption = await $('//div[@class = "nav-dd-link-text"]//div[contains(.,"' + options + '")]');
        currentOptionName = await currentOption.getText();
        await currentOption.click();
        cucumberJson.attach("Current Option selected: " + currentOptionName);
        console.log("Current Option selected: " + currentOptionName);
    }

    async verifyPageLoads(options) {
        let currentPage, currentPageName;
        await browser.pause(5000);
        currentPage = await $('//h1[contains(.,"' + options + '")]');
        currentPageName = await currentPage.getText();
        if (await currentPage.isExisting()) {
            cucumberJson.attach("Current page: " + currentPageName + " is loading");
        }
        else {
            assert.fail("Current page is not loading");
        }
    }

    async selectPdfFileToUpload() {
        //Path of the file to be uploaded
        const filePath = path.join(__dirname, '../../testdata/SamplePdf.pdf');
        const remoteFilePath = await browser.uploadFile(filePath);

        //Locator for hidden input element
        const input = await $('#real_file');

        // executing Javascript to make the hidden input file visible
        await browser.execute(function () {
            document.getElementById('real_file').style.display = "block";
        });

        await input.waitForExist();
        await input.setValue(remoteFilePath);
        await browser.pause(10000);
        cucumberJson.attach("File uploaded successfully");
    }

    async closeBrowserCookiesPopup() {
        await this.cookiePopUp.waitForExist();
        let isCookieVisible = await this.cookiePopUp.isExisting();
        if (isCookieVisible) {
            await this.cookieDenyButton.waitForClickable();
            await this.cookieDenyButton.click();
            cucumberJson.attach("Cookie Denied");
        }
    }

    async verifySplitDocumentLoads() {

        //This is checking if the page is loading after performing the upload
        await browser.pause(2000);
        let splitDocument;
        splitDocument = await $('(//div[@id = "main-document"])[1]');
        await browser.pause(3000);
        if (splitDocument.isExisting()) {
            cucumberJson.attach("Document is ready to split");
        }
        else {
            assert.fail("Split document page is not loading");
        }
    }

    async countThePages() {
        let pages;
        await browser.pause(5000);
        let frame = await $('//div[@id = "review-popup"]//iframe');
        await frame.waitForExist();

        //The element to be interacted is wrapped within an iframe
        //Hence we are switching to the iframe
        await browser.switchToFrame(frame);
        cucumberJson.attach("Switched to iFrame: ");
        await browser.pause(5000);

        //This will count the number of pages we have uploaded from the pdf
        pages = await $$('//p[@class = "FpmCk"]');
        pageCount = await pages.length;
        cucumberJson.attach("Number of pages in the document " + pageCount);
        let currentUrl = await browser.getUrl();
        cucumberJson.attach("Current Url: " + currentUrl);
        let pageCountCorner;


        //Here we are trying to get the count of pages from the top right corner of the page
        var getHTML = await $('.f2b2c').getHTML();
        // Using webscraping library to get Text from an non interactable web element 
        const loc = cheerio.load(getHTML);
        pageCountCorner = loc('.f2b2c').text();
        // cucumberJson.attach("Html " + getHTML);

        cucumberJson.attach("Page count from right top corner: " + pageCountCorner);

        if ((pageCountCorner == pageCount)) {
            cucumberJson.attach("The number of pages in the document is correct ");
        }
        else {
            assert.fail("Page count is not valid");
        }
    }

    async splitTheDocument() {
        let scissorIcons, scissorIconsCount, currentScissorIcon;
        scissorIcons = await $$('.Em0ax');

        //This is to find the total number of scissor icons available to perform the split
        scissorIconsCount = await scissorIcons.length;
        
        cucumberJson.attach("Total scissor icons: " + scissorIconsCount);
        console.log('scissorIconsCount', scissorIconsCount);
        for(let iterator = 0 ; iterator < scissorIconsCount ; iterator ++) {
            
            //Using Javascript executor to cut the document
            await browser.execute(function () {
                document.getElementsByClassName('Em0ax')[0].click();
            });
            await browser.pause(1000);
        }
        cucumberJson.attach("Document have been split successfully ");
    }

    async clickOnSplitPdfButton() {

        // This will click Split pdf button to download the zipped file
        let button;
        await this.splitPdfButton.waitForExist();
        button = await this.splitPdfButton.getText();
        
        await browser.execute(function () {
            document.getElementsByClassName('_2-e9i Cb_qF _2inO5 p9ptM')[1].click();
        });

        await browser.pause(5000);
        cucumberJson.attach(button + " button clicked");
    }

    async verifyZipFileDownloaded() {
        await browser.pause(15000);

        // This is to check if the file is downloaded in zip format
        if(fs.existsSync(downloadDir + '/SamplePdf.zip')) {
            cucumberJson.attach('Zip file downloaded successfully');
        }      
        else {
            assert.fail("Zip file not loaded: " + error)
        } 
    }

    async unzipTheDownloadedFile() {
        await browser.pause(3000);
        //Zip file input variable
        let zipFilePath = path.join(__dirname, '../../testdata/downloads/SamplePdf.zip');

        //Zip file out variable
        let extractPath = path.join(__dirname, '../../testdata/downloads');

        //Using adm-zip library to perform the unzip of documents
        let zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractPath, true);

        await browser.pause(2000);
        if(fs.existsSync(downloadDir + '/SamplePdf')) {
            cucumberJson.attach('The file is unzipped');
        }

        else {
            assert.fail("File is not unzipped");
        }
    }

    async countTheNumberOfDocuments() {

        // This method is counting the number of Documents in the unzipped folder
        await browser.pause(2000);
        let folderPath = path.join(__dirname, '../../testdata/downloads/SamplePdf');
        let fileCount = fs.readdirSync(folderPath).length;
        cucumberJson.attach("Files count in the foler: " + fileCount);
         
        if(pageCount == fileCount) {
            cucumberJson.attach('Number of files extracted equals to number of pages in the file');
        }
        else {
            assert.fail('Number of files extracted do not equals to number of pages in the file');
        }
    }

    async verifyExtensionOfDocuments() {
        // Verifying if the filename contains extension as pdf
        let folderPath = path.join(__dirname, '../../testdata/downloads/SamplePdf');
        let fileNames = fs.readdirSync(folderPath);

        fileNames.forEach( (fileName) => {
            let fileExtension = path.extname(fileName);      
            if ( fileExtension == '.pdf') {
                cucumberJson.attach('The file holds valid extension' + fileExtension);
            }

            else {
                assert.fail('File extensions are invalid');
            }
        });
    }
}
export default new PdfDownload();