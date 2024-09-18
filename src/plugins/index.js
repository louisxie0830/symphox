import pinia from '../stores';
import router from '../router';
import fetchPlugin from './fetchPlugin';
import vuetify from './vuetify';

export function registerPlugins(app) {
    app.use(vuetify).use(pinia).use(fetchPlugin, { baseURL: import.meta.env.VITE_API_URL }).use(router);
}