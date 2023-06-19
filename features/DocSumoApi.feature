Feature: API Testing

    @ApiTest
    Scenario: Verify user is able to split the pdf files and download the same

        Given url 'https://httpbin.org/image'
        And header accept = 'accept:image/webp'
        When method GET
        Then status 200
        Then match responseHeaders['Content-Type'] contains 'image/webp'

    Scenario: Set the Cookies
        Given url 'https://httpbin.org/cookies/set'
        And params { student_name: 'Akanksha'}
        And header accept = 'application/json'
        When method GET
        Then status 200


        Given url 'https://httpbin.org/cookies'
        And header accept = 'application/json'
        When method GET
        Then status 200
        And match response contains { student_name: 'Akanksha'}