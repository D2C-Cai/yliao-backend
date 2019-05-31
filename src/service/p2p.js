import axios from './../axios'
import BaseService from './base'

/**
 * P2P平台管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class P2PService extends BaseService {
    constructor() {
        super('p2p')
    }

    fadadaCert(id) {
        return axios.post('/p2p/fadada/apply', {id: id.toString()})
    }

    fadadaSign(id) {
        return axios.post('/p2p/fadada/sign', {id: id.toString()})
    }
}

export default new P2PService()
