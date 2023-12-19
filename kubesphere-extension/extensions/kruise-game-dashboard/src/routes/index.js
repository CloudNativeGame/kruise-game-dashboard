import React from 'react';
import App from '../App';
import ClusterOverview from "../components/ClusterOverview";
import GameServerSetList from "../components/GameServerSetList";
import GameServerList from "../components/GameServerList";


export default [
    {
        path: '/clusters/:name/kruise-game-dashboard',
        element: <App/>,
        children: [
            {
                path: '/clusters/:name/kruise-game-dashboard/overview',
                element: <ClusterOverview/>,

            },
            {
                path: '/clusters/:name/kruise-game-dashboard/gameserversets/',
                element: <GameServerSetList/>,
            },
            {
                path: '/clusters/:name/kruise-game-dashboard/gameservers/',
                element: <GameServerList/>,
            },
        ]
    },
];
