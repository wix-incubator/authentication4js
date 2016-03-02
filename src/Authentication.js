'use strict'

import {CommonProtocolClient} from './CommonProtocolClient'

export class Authentication {
    constructor({XMLHttpRequest, endpointUrl = 'https://auth.openrest.com/v1.0', timeout = 0}) {
        this._client = new CommonProtocolClient({XMLHttpRequest, endpointUrl, timeout})
    }
    wix({instance, appKey}) {
        return this._client.doRequest({type:'wix.loginInstance', instance, appKey})
    }
    openrest({username, password}) {
        return this._client.doRequest({type:'openrest.login', username, password})
    }
    google({idToken, clientId}) {
        return this._client.doRequest({type:'google.login', idToken, clientId})
    }
    facebook({accessToken}) {
        return this._client.doRequest({type:'facebook.login', accessToken})
    }
}
