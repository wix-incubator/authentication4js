'use strict'

import {CommonProtocolClient} from './CommonProtocolClient.js'

export class Authentication {
    constructor({XMLHttpRequest, endpointUrl, timeout}) {
        this.client = new CommonProtocolClient({
            XMLHttpRequest: XMLHttpRequest,
            endpointUrl: endpointUrl || 'https://auth.openrest.com/v1.0',
            timeout: timeout || 0
        })
    }
    wix({instance, appKey}) {
        return this.client.doRequest({type:'wix.loginInstance', instance, appKey})
    }
    openrest({username, password}) {
        return this.client.doRequest({type:'openrest.login', username, password})
    }
    google({idToken, clientId}) {
        return this.client.doRequest({type:'google.login', idToken, clientId})
    }
}
