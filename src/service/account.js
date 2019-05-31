import BaseService from './base'

/**
 * 账号管理
 *
 * @class AccountService
 * @extends {BaseService}
 */
class AccountService extends BaseService {
    constructor() {
        super('account')
    }
}

export default new AccountService()
