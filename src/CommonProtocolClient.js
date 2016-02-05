'use strict'

import Q from 'q'

export class CommonProtocolClient {
	constructor({XMLHttpRequest, endpointUrl, timeout = 0}) {
		this._XMLHttpRequest = XMLHttpRequest
		this._endpointUrl = endpointUrl
		this._timeout = timeout
	}
	doRequest(request) {
		const deferred = Q.defer()
		
		const xhr = new this._XMLHttpRequest()
		xhr.ontimeout = () => {
			deferred.reject({
				code: 'timeout',
				description: 'request timed out'
			})
		}
		xhr.onerror = () => {
			deferred.reject({
				code: 'network_down',
				description: 'network is down'
			})
		}
		xhr.onload = () => {
			try {
				const response = JSON.parse(xhr.response)
				if (response.error) {
					deferred.reject(response.error)
				} else {
					deferred.resolve(response.value)
				}
			} catch (e) {
				deferred.reject({
					code: 'protocol',
					description: 'unexpected response format'
				})
			}
		}
		
		xhr.open('POST', this._endpointUrl, true)
		xhr.timeout = this._timeout
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.send(JSON.stringify(request))
		
		return deferred.promise
	}
}
