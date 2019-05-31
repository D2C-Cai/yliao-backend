const routes = [
    {
        name: 'index',
        path: '/',
        component: () => import('./../view/dashboard'),
        redirect: '/main',
        meta: {
            title: '控制面板',
            auth: true,
            keepAlive: true
        },
        children: [
            {
                name: 'Main',
                path: 'main',
                component: () => import('./../view/common/main'),
                meta: {
                    title: '控制面板首页'
                }
            },
        ]
    },
    {
        name: 'Product',
        path: '/product',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'ProductInsert',
                path: 'insert',
                component: () => import('./../view/product/item'),
                meta: {
                    title: '添加商品'
                }
            },
            {
                name: 'ProductEdit',
                path: 'edit/:id',
                component: () => import('./../view/product/item'),
                props: true,
                meta: {
                    title: '编辑商品'
                }
            },
            {
                name: 'ProductList',
                path: 'list',
                component: () => import('./../view/product/list'),
                meta: {
                    title: '商品管理',
                    keepAlive: true
                }
            },
            {
                name: 'ProductCategory',
                path: 'category',
                component: () => import('./../view/product/category'),
                meta: {
                    title: '商品分类管理'
                }
            },
            {
                name: 'Brand',
                path: 'brand',
                component: () => import('./../view/product/brand'),
                meta: {
                    title: '品牌管理'
                }
            },
            {
                name: 'Freight',
                path: 'freight',
                component: () => import('./../view/product/freight'),
                meta: {
                    title: '运费模板管理'
                }
            }
        ]
    },
    {
        name: 'Order',
        path: '/order',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'OrderList',
                path: 'list',
                component: () => import('./../view/order/list'),
                meta: {
                    title: '订单管理'
                }
            },
            {
                name: 'OrderItem',
                path: 'item',
                component: () => import('./../view/order/item'),
                meta: {
                    title: '订单明细管理'
                }
            },
        ]
    },
    {
        name: 'Member',
        path: '/member',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'MemberList',
                path: 'list',
                component: () => import('./../view/member/list'),
                meta: {
                    title: '会员管理'
                }
            },
            {
                name: 'CartList',
                path: 'cart',
                component: () => import('./../view/member/cart'),
                meta: {
                    title: '查看购物车'
                }
            },
            {
                name: 'AddressList',
                path: 'address',
                component: () => import('./../view/member/address'),
                meta: {
                    title: '查看地址'
                }
            },
        ]
    },
    {
        name: 'SupplierCenter',
        path: '/supplier',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'SupplierProductInsert',
                path: '/supplier/product/insert',
                component: () => import('./../view/supplier/product_item'),
                meta: {
                    title: '添加商品'
                }
            },
            {
                name: 'SupplierProductEdit',
                path: '/supplier/product/edit/:id',
                component: () => import('./../view/supplier/product_item'),
                props: true,
                meta: {
                    title: '编辑商品'
                }
            },
            {
                name: 'SupplierProductList',
                path: '/supplier/product/list',
                component: () => import('./../view/supplier/product_list'),
                meta: {
                    title: '管理商品'
                }
            },
            {
                name: 'SupplierBrandList',
                path: '/supplier/brand/list',
                component: () => import('./../view/product/brand'),
                meta: {
                    title: '管理品牌'
                }
            },
            {
                name: 'SupplierOrder',
                path: '/supplier/order/list',
                component: () => import('./../view/supplier/order_list'),
                meta: {
                    title: '订单管理'
                }
            }
        ]
    },
    {
        name: 'Platform',
        path: '/platform',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'ChangeInfo',
                path: 'info',
                component: () => import('./../view/platform/info'),
                meta: {
                    title: '平台信息维护'
                }
            },
            {
                name: 'MyMember',
                path: 'member',
                component: () => import('./../view/platform/member'),
                meta: {
                    title: '会员列表'
                }
            },
            {
                name: 'MyProduct',
                path: 'product',
                component: () => import('./../view/platform/product'),
                meta: {
                    title: '商品管理'
                }
            },
            {
                name: 'MyOrder',
                path: 'order',
                component: () => import('./../view/platform/order'),
                meta: {
                    title: '订单管理'
                }
            }
        ]
    },
    {
        name: 'Merchant',
        path: '/merchant',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'Supplier',
                path: 'supplier',
                component: () => import('./../view/merchant/supplier'),
                meta: {
                    title: '供应商管理'
                }
            },
            {
                name: 'P2P',
                path: 'p2p',
                component: () => import('./../view/merchant/p2p'),
                meta: {
                    title: 'P2P平台管理'
                }
            }
        ]
    },
    {
        name: 'System',
        path: '/system',
        component: () => import('./../view/dashboard'),
        children: [
            {
                name: 'User',
                path: 'user',
                component: () => import('./../view/system/user'),
                meta: {
                    title: '用户设置'
                }
            },
            {
                name: 'Role',
                path: 'role',
                component: () => import('./../view/system/role'),
                meta: {
                    title: '角色管理'
                }
            },
            {
                name: 'Menu',
                path: 'menu',
                component: () => import('./../view/system/menu'),
                meta: {
                    title: '菜单管理'
                }
            }
        ]
    },
    {
        name: 'Login',
        path: '/login',
        component: () => import('../view/login'),
        meta: {
            title: '管理登录',
            keepAlive: false
        }
    },
]
export default routes
