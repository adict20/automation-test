Feature: API Testing

    @ApiTest
    Scenario: Verify user is able to split the pdf files and download the same

        Given url 'https://httpbin.org/image'
        And header accept = 'accept:image/webp'
        When method GET
        Then status 200
        Then match responseHeaders['Content-Type'] contains 'image/webp'

    Scenario: Set the Cookies

        * def sessionId = ''
        Given url 'https://httpbin.org/cookies/set'
        And params { student_name: 'Network'}
        And params { student_id: '12344'}
        And header accept = 'application/json'
        When method GET
        * print response
        Then status 200

    # Scenario: Verify the Cookies

        * configure cookies = { path: '/', domain : 'httpbin.org', secure: true, httpOnly: false, student_name: 'Network', student_id : '12344' }

        Given url 'https://httpbin.org/cookies'
        And header accept = 'application/json'
        And header Cookie = 'JSESSIONID=' + sessionId
        When method GET
        Then status 200
        * print response
        * def jsonResponse = response
        And match jsonResponse.cookies contains {student_name: 'Network', student_id : '12344'}
 
    Scenario: Delete the cookies

        * configure cookies = { path: '/', domain : 'httpbin.org', secure: true, httpOnly: false, student_name: 'Network', student_id : '12344' }
        Given url 'https://httpbin.org/cookies/delete'
        And params { student_id: '12344'}
        And header accept = 'application/json'
        When method GET
        Then status 200
        * print response

        # Scenario: Verify the Cookies

        * configure cookies = { path: '/', domain : 'httpbin.org', secure: true, httpOnly: false, student_name: 'Network'}
        Given url 'https://httpbin.org/cookies'
        And header accept = 'application/json'
        When method GET
        Then status 200
        * print response
        * def jsonResponse = response
        And match jsonResponse.cookies !contains {student_id : '12344'}