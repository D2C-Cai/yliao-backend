import BaseService from './base'

/**
 * 运费管理
 *
 * @class FreightService
 * @extends {BaseService}
 */
class FreightService extends BaseService {
    constructor() {
        super('freight')
    }
}

export default new FreightService()
