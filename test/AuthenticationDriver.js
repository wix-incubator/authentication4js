"use strict"

import {CommonProtocolDriver} from "./CommonProtocolDriver.js"

export class AuthenticationDriver {
	constructor({port}) {
		this.driver = new CommonProtocolDriver({port})
	}
	start() {
		this.driver.start()
	}
	stop() {
		this.driver.stop()
	}
	reset() {
		this.driver.reset()
	}
	addRule({request, response, delay, useRawResponse}) {
		this.driver.addRule({request, response, delay, useRawResponse})
	}
}
