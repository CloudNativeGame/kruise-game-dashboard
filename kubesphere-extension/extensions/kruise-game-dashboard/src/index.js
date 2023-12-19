import routes from './routes';
import locales from './locales';

const menu = {
    parent: 'cluster',
    name: 'kruise-game-dashboard',
    title: 'kruise-game-dashboard',
    icon: 'cluster',
    order: 20,
    desc: 'kruise-game-dashboard is an ops dashboard to help game developers to manage game servers on kubernetes with OpenKruiseGame.',
    authKey: "kruise-game-dashboard",
    skipAuth: true,
};

const extensionConfig = {
    routes,
    menus: [menu],
    locales,
};

globals.context.registerExtension(extensionConfig);
