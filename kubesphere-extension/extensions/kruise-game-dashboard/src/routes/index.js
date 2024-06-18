import React from 'react';
import App from '../App';
import ClusterOverview from "../components/ClusterOverview";
import GameServerSetList from "../components/GameServerSetList";
import GameServerList from "../components/GameServerList";
import GlobalControlView from "../views/global/GlobalControlView";
import GlobalOverview from '../components/GlobalOverview';
import GlobalConfiguration from "../components/GlobalConfiguration";
import DeployUnitList from "../components/DeployUnitList";
import ProjectList from "../components/ProjectList";
import ProjectDetailView from "../views/project/ProjectDetailView";
import ProjectOverview from "../components/ProjectOverview";
import ProjectGameServerSetList from "../components/ProjectGameServerSetList";
import ProjectGameServerList from "../components/ProjectGameServerList";
import ProjectMatchService from "../components/ProjectMatchService";

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
                path: '/clusters/:name/kruise-game-dashboard/gameservers/:gameserverset?',
                element: <GameServerList/>,
            },
        ]
    },
    {
        path: '/kruise-game-dashboard',
        element: <GlobalControlView/>,
        children: [
            {
                path: '/kruise-game-dashboard/overview',
                element: <GlobalOverview/>,
            },
            {
                path: '/kruise-game-dashboard/configuration',
                element: <GlobalConfiguration/>,
            },
            {
                path: '/kruise-game-dashboard/projects',
                element: <ProjectList/>,
            },
            {
                path: '/kruise-game-dashboard/deployunits',
                element: <DeployUnitList/>,
            }
        ]
    },
    {
        path: '/kruise-game-dashboard/projects/:projectId',
        element: <ProjectDetailView/>,
        children: [
            {
                path: '/kruise-game-dashboard/projects/:projectId/overview',
                element: <ProjectOverview/>,
            },
            {
                path: '/kruise-game-dashboard/projects/:projectId/gameserversets',
                element: <ProjectGameServerSetList/>,
            },
            {
                path: '/kruise-game-dashboard/projects/:projectId/gameservers',
                element: <ProjectGameServerList/>,
            },
            {
                path: '/kruise-game-dashboard/projects/:projectId/matchservice',
                element: <ProjectMatchService/>,
            }
        ]
    },
];
