import BaseService from './base'
import axios from './../axios'

/**
 * 商品SKU管理
 *
 * @class ProductSkuService
 * @extends {BaseService}
 */
class ProductSkuService extends BaseService {
    constructor() {
        super('product_sku')
    }

    updateStock(params) {
        return axios.post('/product_sku/update/stock', params)
    }
}

export default new ProductSkuService()
