import React, {useEffect} from 'react';
import {CssBaseline, KubedConfigProvider} from "@kubed/components";
import {NavMenu, NavTitle} from "@ks-console/shared";
import {Group} from "@kubed/icons";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";

const PageSide = styled.div`
  position: fixed;
  top: 88px;
  padding: 0 20px 40px;
  width: 260px;
  z-index: 99;
`;

const PageMain = styled.div`
  margin-left: 240px;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

function ProjectDetailView(props) {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const project_id = params.projectId

    let prefix = "/kruise-game-dashboard/projects/" + project_id;

    const navs = [
        {
            name: 'project',
            children: [
                {
                    name: 'overview',
                    icon: 'human',
                    title: 'Overview',
                },
                {
                    name: 'gameserversets',
                    icon: 'bird',
                    title: 'gameserversets',
                },
                {
                    name: 'gameservers',
                    icon: 'bird',
                    title: 'gameservers',
                },
                {
                    name: 'matchservice',
                    icon: 'bird',
                    title: 'MatchService',
                },
            ],
        },
    ];

    useEffect(() => {
        // add default location redirect to overview
        console.log(location.p)
        if (location.pathname === prefix) {
            navigate(location.pathname + '/overview', {replace: true});
        }
    }, []);

    return (
        <>
            <KubedConfigProvider>
                <CssBaseline/>
                <PageSide>
                    <NavTitle
                        icon={<Group variant="light" size={40}/>}
                        title={t('Projects')}
                        style={{marginBottom: '20px'}}
                    />
                    <NavMenu navs={navs} pathname={location.pathname} prefix={prefix}/>
                </PageSide>
                <PageMain>
                    <Outlet/>
                </PageMain>
            </KubedConfigProvider>
        </>
    );
}

export default ProjectDetailView;
