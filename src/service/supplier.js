import BaseService from './base'

/**
 * 供应商管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class SupplierService extends BaseService {
    constructor() {
        super('supplier')
    }
}

export default new SupplierService()
