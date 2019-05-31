import BaseService from './base'

/**
 * P2P平台管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class P2PProductService extends BaseService {
    constructor() {
        super('p2p_product')
    }
}

export default new P2PProductService()
