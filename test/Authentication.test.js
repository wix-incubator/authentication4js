"use strict"

import {Authentication} from "../src/Authentication.js"
import {AuthenticationDriver} from "./AuthenticationDriver.js"
import {expect, assert} from "chai"
import {XMLHttpRequest} from "xhr2"

describe("Authentication", function() {
	let tokenizerServicePort = 10000
	let driver = new AuthenticationDriver({
		port: tokenizerServicePort
	})
	let endpointUrl = "http://localhost:" + tokenizerServicePort + "/"
	let invalidEndpointUrl = "http://thisisanonexistentdomain.thisdoesntexist/"
	
	let authentication = new Authentication({XMLHttpRequest, endpointUrl})
	
	let wixLoginRequest = {
        type: "wix.loginInstance",
		instance: "instance",
        appKey: "appKey"
	}
	let wixLoginResponse = {
		response: "blahblah" // TODO? Real response?
	}
	
	let someError = {
		code: "someCode",
		description: "someDescription"
	}
	
	before(function() {
		driver.start()
	})
	
	after(function() {
		driver.stop()
	})
	
	beforeEach(function() {
		driver.reset()
	})
	
	describe("wix", function() {

		it ('authenticates wix correctly', function() {

			driver.addRule({
				request: wixLoginRequest,
				response: {
					value: wixLoginResponse
				}
			})
			
			return authentication.wix({instance:"instance", appKey:"appKey"}).then(function(response) {
				expect(response).to.deep.equal(wixLoginResponse);
			}, function(error) {
				assert.ok(false, "Invalid response " + JSON.stringify(error))
			})
		})
		
		it ('gracefully fails on invalid authentication', function() {
			driver.addRule({
				request: wixLoginRequest,
				response: {
					error: someError
				}
			})
			
			return authentication.wix({instance:"instance", appKey:"appKey"}).then(function(response) {
				// Unexpected success
				assert.ok(false, "Tokenizing should have failed " + JSON.stringify(response))
			}, function(error) {
				expect(error).to.deep.equal(someError)
			})
		})
		
		it ('gracefully fails on timeout', function() {
			let authenticationWithTimeout = new Authentication({
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
			
			return authenticationWithTimeout.wix({instance:"instance", appKey:"appKey"}).then(function(response) {
				// Unexpected success
				assert.ok(false, "Request should have timed out, but returned " + JSON.stringify(response))
			}, function(error) {
				expect(error.code).to.equal("timeout")
				expect(error.description).to.not.be.empty
			})
		})
		
		it ('gracefully fails when network is down', function() {
			let authenticationWithInvalidEndpointUrl = new Authentication({
				XMLHttpRequest: XMLHttpRequest,
				endpointUrl: invalidEndpointUrl
			})
			
			return authenticationWithInvalidEndpointUrl.wix({instance:"instance", appKey:"appKey"}).then(function(response) {
				// Unexpected success
				assert.ok(false, "Network should be down, but request returned " + JSON.stringify(response))
			}, function(error) {
				expect(error.code).to.equal("network_down")
				expect(error.description).to.not.be.empty
			})
		})
		
		it ('gracefully fails on protocol error', function() {
			driver.addRule({
				request: wixLoginRequest,
				response: "<html><head><title>Error 500</title></head></html>",
				useRawResponse: true
			})
			
			return authentication.wix({instance:"instance", appKey:"appKey"}).then(function(response) {
				// Unexpected success
				assert.ok(false, "Expected protocol error, but request returned " + JSON.stringify(response))
			}, function(error) {
				expect(error.code).to.equal("protocol")
				expect(error.description).to.not.be.empty
			})
		})
	})
})
