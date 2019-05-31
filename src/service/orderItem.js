import BaseService from './base'
import axios from "../axios";
import qs from 'qs'

/**
 * 订单管理
 *
 * @class BrandService
 * @extends {BaseService}
 */
class OrderItemService extends BaseService {
    constructor() {
        super('order_item')
    }

    excel(params) {
        return axios.get('/order_item/excel/page?' + qs.stringify(params))
    }

    deliver(params) {
        return axios.post('/order_item/deliver', params)
    }
}

export default new OrderItemService()
