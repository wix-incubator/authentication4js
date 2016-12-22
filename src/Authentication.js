import {CommonProtocolClient} from './CommonProtocolClient'

class Authentication {
    constructor({XMLHttpRequest, endpointUrl = 'https://auth.wixrestaurants.com/v1.0', timeout = 0}) {
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
    authenticate({accessToken}) {
        return this._client.doRequest({type:'authenticate', accessToken})
    }
}

export { Authentication }
