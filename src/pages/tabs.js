import React from 'react'
import LoadableComponent from '../utils/LoadableComponent'
const Account = LoadableComponent(import('./Setting/Account'), true);
const Permission = LoadableComponent(import('./Setting/Permission'), true);
const Role = LoadableComponent(import('./Setting/Role'), true);
const Menu = LoadableComponent(import('./Setting/Menu'), true);
const Home = LoadableComponent(import('./Home/index'), true);
const Banners = LoadableComponent(import('./Banners/index'), true);
const Generalize = LoadableComponent(import('./Platform/Generalize'), true);
const Stick = LoadableComponent(import('./Platform/Stick/index'), true);
const Trade = LoadableComponent(import('./Trade/index'), true);
const Order = LoadableComponent(import('./Orders/index'), true);
const Transfer = LoadableComponent(import('./Transfer/index'), true);

const tabs = {
    Home: <Home />,
    Banner:<Banners />,
    Order: <Order />,
    Trade: <Trade />,
    Transfer: <Transfer />,
    Generalize: <Generalize />,
    Stick: <Stick />,

    Menu: <Menu />,
    Permission: <Permission/>,
    Role: <Role />,
    Account: <Account />,
};

export {
    tabs
}
