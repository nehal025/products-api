const AdminBro = require('admin-bro')
const AdminBroMongoose = require('admin-bro-mongoose')
const Product = require('../models/productModel');
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
AdminBro.registerAdapter(AdminBroMongoose)

const contentParent = {
    name: 'DATABASE',
}

const locale = {
    translations: {
      labels: {
        // change Heading for Login
        loginWelcome: 'Welcome to Blind Product  Detection',
      },
      messages: {
        loginWelcome: 'Admin Panel',
      },
    },
  };

const adminBro = new AdminJS({
    resources: [
        { resource: Product, options: { parent: contentParent } },
    ], rootPath: '/admin',
    branding:
    {
        logo: 'https://img.freepik.com/free-vector/server-control-panel-hosting-software-vector-illustration_116137-337.jpg?w=740',
        companyName: "BlindProductDetection",
        softwareBrothers: false,

    },
    locale,
    dashboard: {
        handler: async () => {

        },
        component: AdminJS.bundle('../Component.jsx')

      },

   
})

const ADMIN = {
    email:process.env.ADMIN_NAME,
    password:process.env.ADMIN_PASSWORD,
}

const router = AdminJSExpress.buildAuthenticatedRouter(adminBro, {

    cookieName: process.env.ADMIN_COOKIE_NAME,
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
    authenticate: async (email, password) => {
        if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN
        }
        return null

    }
})

module.exports = router;