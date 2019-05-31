import BaseService from './base'

/**
 * 购物车管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class AddressService extends BaseService {
    constructor() {
        super('address')
    }
}

export default new AddressService()
