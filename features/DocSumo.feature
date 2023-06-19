Feature: DocSumo Split the PDF file

    @pdfDownload
    Scenario: Verify user is able to split the pdf files and download the same

        Given User is on the DocSumo webpage
        When User hovers on Tools
        And User selects the option <options>
        Then User should be navigated to <options> page
        When User selects a pdf file to upload
        Then The split document should load
        And User counts the number of pages in the document
        And User splits the document 
        And User clicks on split button
        Then Zip file should be downloaded
        When User unzip the downloaded files
        Then Downloaded folder should have same number of documents
        Then Extension of the downloaded files should be pdfs
        Examples:
            | options           |
            | Split PDF by Page |