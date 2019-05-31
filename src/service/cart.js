import BaseService from './base'

/**
 * 购物车管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class CartService extends BaseService {
    constructor() {
        super('cart')
    }
}

export default new CartService()
