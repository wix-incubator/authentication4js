import {Authentication} from '../src/Authentication'
import {AuthenticationDriver} from './AuthenticationDriver'
import {expect, assert} from 'chai'
import {XMLHttpRequest} from 'xhr2'

describe('Authentication', () => {
    const tokenizerServicePort = 10000
    const driver = new AuthenticationDriver({
        port: tokenizerServicePort
    })
    const endpointUrl = `http://localhost:${tokenizerServicePort}/`
    const invalidEndpointUrl = 'http://thisisanonexistentdomain.thisdoesntexist/'

    const authentication = new Authentication({XMLHttpRequest, endpointUrl})

    const wixLoginRequest = {
        type: 'wix.loginInstance',
        instance: 'instance'
    }

    const openrestLoginRequest = {
        type: 'openrest.login',
        username: 'username',
        password: 'password'
    }

    const googleLoginRequest = {
        type: 'google.login',
        idToken: 'idToken',
        clientId: 'clientId'
    }

	const someFacebookAccessToken = 'some facebook access token'
    const facebookLoginRequest = {
        type: 'facebook.login',
        accessToken: someFacebookAccessToken
    }
	
	const someAccessToken = 'some access token'
    const authenticateRequest = {
        type: 'authenticate',
        accessToken: someAccessToken
    }

    const wixLoginResponse = {
		user: {
			ns: 'com.wix',
			id: 'some wix user ID'
		},
		accessToken: someAccessToken
    }

    const openrestLoginResponse = {
		user: {
			ns: 'com.openrest',
			id: 'some email'
		},
		accessToken: someAccessToken
    }

    const googleLoginResponse = {
		user: {
			ns: 'com.google',
			id: 'some Google user ID'
		},
		accessToken: someAccessToken
    }

    const facebookLoginResponse = {
		user: {
			ns: 'com.facebook',
			id: 'some Facebook user  ID'
		},
		accessToken: someAccessToken
    }
	
    const authenticateResponse = {
        ns: "some namespace",
		id: "some user ID"
    }

    const someError = {
        code: 'someCode',
        description: 'someDescription'
    }

    before(() => {
        driver.start()
    })

    after(() => {
        driver.stop()
    })

    beforeEach(() => {
        driver.reset()
    })

    describe('wix.login', () => {
        it ('authenticates wix correctly', () => {
            driver.addRule({
                request: wixLoginRequest,
                response: {
                    value: wixLoginResponse
                }
            })

            return authentication.wix({
				instance: wixLoginRequest.instance
			}).then((response) => {
                expect(response).to.deep.equal(wixLoginResponse);
            }, (error) => {
                assert.ok(false, `Invalid response ${JSON.stringify(error)}`)
            })
        })

        it ('gracefully fails on invalid authentication', () => {
            driver.addRule({
                request: wixLoginRequest,
                response: {
                    error: someError
                }
            })

            return authentication.wix({
				instance: wixLoginRequest.instance
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Tokenizing should have failed ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error).to.deep.equal(someError)
            })
        })

        it ('gracefully fails on timeout', () => {
            const authenticationWithTimeout = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: endpointUrl,
                timeout: 10
            })

            driver.addRule({
                request: wixLoginRequest,
                response: {
                    value: wixLoginResponse
                },
                delay: 100
            })

            return authenticationWithTimeout.wix({
				instance: wixLoginRequest.instance
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Request should have timed out, but returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('timeout')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails when network is down', () => {
            const authenticationWithInvalidEndpointUrl = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: invalidEndpointUrl
            })

            return authenticationWithInvalidEndpointUrl.wix({
				instance: wixLoginRequest.instance
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Network should be down, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('network_down')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails on protocol error', () => {
            driver.addRule({
                request: wixLoginRequest,
                response: '<html><head><title>Error 500</title></head></html>',
                useRawResponse: true
            })

            return authentication.wix({
				instance: wixLoginRequest.instance
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('protocol')
                expect(error.description).to.not.be.empty
            })
        })
    })

    describe('openrest.login', () => {
        it ('authenticates openrest correctly', () => {
            driver.addRule({
                request: openrestLoginRequest,
                response: {
                    value: openrestLoginResponse
                }
            })

            return authentication.openrest({username:'username', password:'password'}).then((response) => {
                expect(response).to.deep.equal(openrestLoginResponse);
            }, (error) => {
                assert.ok(false, `Invalid response ${JSON.stringify(error)}`)
            })
        })

        it ('gracefully fails on invalid authentication', () => {
            driver.addRule({
                request: openrestLoginRequest,
                response: {
                    error: someError
                }
            })

            return authentication.openrest({
				username: openrestLoginRequest.username,
				password: openrestLoginRequest.password
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Tokenizing should have failed ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error).to.deep.equal(someError)
            })
        })

        it ('gracefully fails on timeout', () => {
            const authenticationWithTimeout = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: endpointUrl,
                timeout: 10
            })

            driver.addRule({
                request: openrestLoginRequest,
                response: {
                    value: openrestLoginResponse
                },
                delay: 100
            })

            return authenticationWithTimeout.openrest({
				username: openrestLoginRequest.username,
				password: openrestLoginRequest.password
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Request should have timed out, but returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('timeout')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails when network is down', () => {
            const authenticationWithInvalidEndpointUrl = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: invalidEndpointUrl
            })

            return authenticationWithInvalidEndpointUrl.openrest({
				username: openrestLoginRequest.username,
				password: openrestLoginRequest.password
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Network should be down, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('network_down')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails on protocol error', () => {
            driver.addRule({
                request: openrestLoginRequest,
                response: '<html><head><title>Error 500</title></head></html>',
                useRawResponse: true
            })

            return authentication.openrest({
				username: openrestLoginRequest.username,
				password: openrestLoginRequest.password
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('protocol')
                expect(error.description).to.not.be.empty
            })
        })
    })

    describe('google.login', () => {
        it ('authenticates google correctly', () => {
            driver.addRule({
                request: googleLoginRequest,
                response: {
                    value: googleLoginResponse
                }
            })

            return authentication.google({
				clientId: googleLoginRequest.clientId,
				idToken: googleLoginRequest.idToken
			}).then((response) => {
                expect(response).to.deep.equal(googleLoginResponse);
            }, (error) => {

                assert.ok(false, `Invalid response ${JSON.stringify(error)}`)
            })
        })

        it ('gracefully fails on invalid authentication', () => {
            driver.addRule({
                request: googleLoginRequest,
                response: {
                    error: someError
                }
            })

            return authentication.google({
				clientId: googleLoginRequest.clientId,
				idToken: googleLoginRequest.idToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Tokenizing should have failed ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error).to.deep.equal(someError)
            })
        })

        it ('gracefully fails on timeout', () => {
            const authenticationWithTimeout = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: endpointUrl,
                timeout: 10
            })

            driver.addRule({
                request: googleLoginRequest,
                response: {
                    value: googleLoginResponse
                },
                delay: 100
            })

            return authenticationWithTimeout.google({
				clientId: googleLoginRequest.clientId,
				idToken: googleLoginRequest.idToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Request should have timed out, but returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('timeout')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails when network is down', () => {
            const authenticationWithInvalidEndpointUrl = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: invalidEndpointUrl
            })

            return authenticationWithInvalidEndpointUrl.google({
				clientId: googleLoginRequest.clientId,
				idToken: googleLoginRequest.idToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Network should be down, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('network_down')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails on protocol error', () => {
            driver.addRule({
                request: googleLoginRequest,
                response: '<html><head><title>Error 500</title></head></html>',
                useRawResponse: true
            })

            return authentication.google({
				clientId: googleLoginRequest.clientId,
				idToken: googleLoginRequest.idToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('protocol')
                expect(error.description).to.not.be.empty
            })
        })
    })
	
    describe('facebook.login', () => {
        it ('authenticates facebook correctly', () => {
            driver.addRule({
                request: facebookLoginRequest,
                response: {
                    value: facebookLoginResponse
                }
            })

            return authentication.facebook({
				accessToken: someFacebookAccessToken
			}).then((response) => {
                expect(response).to.deep.equal(facebookLoginResponse);
            }, (error) => {

                assert.ok(false, `Invalid response ${JSON.stringify(error)}`)
            })
        })

        it ('gracefully fails on invalid authentication', () => {
            driver.addRule({
                request: facebookLoginRequest,
                response: {
                    error: someError
                }
            })

            return authentication.facebook({
				accessToken: someFacebookAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Tokenizing should have failed ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error).to.deep.equal(someError)
            })
        })

        it ('gracefully fails on timeout', () => {
            const authenticationWithTimeout = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: endpointUrl,
                timeout: 10
            })

            driver.addRule({
                request: facebookLoginRequest,
                response: {
                    value: facebookLoginResponse
                },
                delay: 100
            })

            return authenticationWithTimeout.facebook({
				accessToken: someFacebookAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Request should have timed out, but returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('timeout')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails when network is down', () => {
            const authenticationWithInvalidEndpointUrl = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: invalidEndpointUrl
            })

            return authenticationWithInvalidEndpointUrl.facebook({
				accessToken: someFacebookAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Network should be down, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('network_down')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails on protocol error', () => {
            driver.addRule({
                request: facebookLoginRequest,
                response: '<html><head><title>Error 500</title></head></html>',
                useRawResponse: true
            })

            return authentication.facebook({
				accessToken: someFacebookAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('protocol')
                expect(error.description).to.not.be.empty
            })
        })
    })
	
    describe('authenticate', () => {
        it ('authenticates correctly', () => {
            driver.addRule({
                request: authenticateRequest,
                response: {
                    value: authenticateResponse
                }
            })

            return authentication.authenticate({
				accessToken: someAccessToken
			}).then((response) => {
                expect(response).to.deep.equal(authenticateResponse);
            }, (error) => {

                assert.ok(false, `Invalid response ${JSON.stringify(error)}`)
            })
        })

        it ('gracefully fails on invalid authentication', () => {
            driver.addRule({
                request: authenticateRequest,
                response: {
                    error: someError
                }
            })

            return authentication.authenticate({
				accessToken: someAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Request should have failed, but returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error).to.deep.equal(someError)
            })
        })

        it ('gracefully fails on timeout', () => {
            const authenticationWithTimeout = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: endpointUrl,
                timeout: 10
            })

            driver.addRule({
                request: authenticateRequest,
                response: {
                    value: authenticateResponse
                },
                delay: 100
            })

            return authenticationWithTimeout.authenticate({
				accessToken: someAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Request should have timed out, but returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('timeout')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails when network is down', () => {
            const authenticationWithInvalidEndpointUrl = new Authentication({
                XMLHttpRequest: XMLHttpRequest,
                endpointUrl: invalidEndpointUrl
            })

            return authenticationWithInvalidEndpointUrl.authenticate({
				accessToken: someAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Network should be down, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('network_down')
                expect(error.description).to.not.be.empty
            })
        })

        it ('gracefully fails on protocol error', () => {
            driver.addRule({
                request: authenticateRequest,
                response: '<html><head><title>Error 500</title></head></html>',
                useRawResponse: true
            })

            return authentication.authenticate({
				accessToken: someAccessToken
			}).then((response) => {
                // Unexpected success
                assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(response)}`)
            }, (error) => {
                expect(error.code).to.equal('protocol')
                expect(error.description).to.not.be.empty
            })
        })
    })
})
