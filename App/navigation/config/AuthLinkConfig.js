import * as Linking from 'expo-linking';

export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        Root: {
            path: 'auth',
            screens: {
                SignUp: 'register',
                SignIn: 'login',
                ForgetPassword: 'pwreset',
            },
        },
    },
};