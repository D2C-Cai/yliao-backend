import BaseService from './base'

/**
 * 品牌管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class BrandService extends BaseService {
    constructor() {
        super('brand')
    }
}

export default new BrandService()
