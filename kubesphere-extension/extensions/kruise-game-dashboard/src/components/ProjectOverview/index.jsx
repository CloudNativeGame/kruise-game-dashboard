import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Badge, Banner, Col, Entity, Field, Row } from '@kubed/components';
import { Icon } from "@ks-console/shared";

function ProjectOverview() {
    const [config, setConfig] = useState({ deployUnits: [], projectLabel: "" });
    const { projectId } = useParams();
    const [deployUnits, setDeployUnits] = useState([]);

    const [counters, setCounters] = useState({
        gsCreating: 0,
        gsUpdating: 0,
        gsDeleting: 0,
        gsReady: 0,
        gsNotReady: 0,
        gsNetwork: 0,
        gsNetworkReady: 0,
        gsNone: 0,
        gsAllocated: 0,
        gsWaitToBeDeleted: 0,
        gsMaintaining: 0,
        totalgameservers:0,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchConfig = async () => {
            try {
                const storedConfig = localStorage.getItem('config');
                if (storedConfig) {
                    const configData = JSON.parse(storedConfig);
                    if (isMounted) {
                        setConfig({ projectLabel: configData.projectLabel, deployUnits: JSON.parse(configData.deployUnits) });
                        setDeployUnits(JSON.parse(configData.deployUnits));
                    }
                } else {
                    const response = await axios.get('/clusters/host/api/v1/namespaces/default/configmaps/configset');
                    if (isMounted) {
                        setConfig({ projectLabel: response.data.projectLabel, deployUnits: JSON.parse(response.data.deployUnits) });
                        setDeployUnits(JSON.parse(response.data.deployUnits));
                        localStorage.setItem('config', JSON.stringify(response.data));
                    }
                }
            } catch (error) {
                console.error('Error fetching config:', error);
            } finally {
                // //////////
            }
        };
        fetchConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchGameServers = async () => {
            const fetchClusterData = async (clusterId) => {
                try {
                    const filterParams = new URLSearchParams({
                        labelSelector: `${config.projectLabel}=${projectId}`
                    }).toString();
                    const response = await axios.get(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/gameservers?${filterParams}`);
                    return (response.items !== undefined ? response.items : response.data.items);
                } catch (error) {
                    console.error(`Error fetching data for cluster ${clusterId}:`, error);
                    return [];
                }
            };

            try {
                const results = await Promise.all(deployUnits.map(fetchClusterData));
                let updatedCounters = {
                    gsCreating: 0,
                    gsUpdating: 0,
                    gsDeleting: 0,
                    gsReady: 0,
                    gsNotReady: 0,
                    gsNetwork: 0,
                    gsNetworkReady: 0,
                    gsNone: 0,
                    gsAllocated: 0,
                    gsWaitToBeDeleted: 0,
                    gsMaintaining: 0,
                    totalgameservers: 0,
                };
                results.forEach(gameServers => {
                    gameServers.forEach(item => {
                        updatedCounters.totalgameservers+=1;
                        if (item.status.currentState === "Creating") updatedCounters.gsCreating += 1;
                        if (item.status.currentState === "Updating") updatedCounters.gsUpdating += 1;
                        if (item.status.currentState === "Deleting") updatedCounters.gsDeleting += 1;
                        if (item.status.currentState === "Ready") updatedCounters.gsReady += 1;
                        if (item.status.currentState === "NotReady") updatedCounters.gsNotReady += 1;
                        if (item.status.networkStatus.networkType !== undefined) updatedCounters.gsNetwork += 1;
                        if (item.status.networkStatus.currentNetworkState === "Ready") updatedCounters.gsNetworkReady += 1;
                        if (item.spec.opsState === "None") updatedCounters.gsNone += 1;
                        if (item.spec.opsState === "Allocated") updatedCounters.gsAllocated += 1;
                        if (item.spec.opsState === "Maintaining") updatedCounters.gsMaintaining += 1;
                        if (item.spec.opsState === "WaitToBeDeleted") updatedCounters.gsWaitToBeDeleted += 1;
                    });
                });


                if (isMounted) {
                    setCounters(updatedCounters);
                    // setGameServers(results.flat());
                }
            } finally {
               ///////
            }
        };

        if (config.deployUnits.length > 0) {
            fetchGameServers();
        }

        return () => {
            isMounted = false;
        };
    }, [config, projectId, deployUnits]);

    return (
        <>
            <Row columns={20}>
                <Col span={16}>
                    <Banner
                        icon={<Icon name="application" size={20} />}
                        title={t("Project_Overview")}
                        description="Overview of the GameServers associated with this project."
                    />
                </Col>
            </Row>

            <Row columns={20}>
                <Col span={16} style={{ background: 'white', borderRadius: '5px' }}>
                    <Row columns={16}>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="default"></Badge>
                                <Field label="Total" value={counters.totalgameservers} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="warning"></Badge>
                                <Field label="Creating" value={counters.gsCreating} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="warning"></Badge>
                                <Field label="Updating" value={counters.gsUpdating} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="error"></Badge>
                                <Field label="Deleting" value={counters.gsDeleting} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                    </Row>

                    <Row columns={16}>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="success"></Badge>
                                <Field label="Ready" value={counters.gsReady} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="warning"></Badge>
                                <Field label="Not Ready" value={counters.gsNotReady} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="default"></Badge>
                                <Field label="Network" value={counters.gsNetwork} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="success"></Badge>
                                <Field label="Network Ready" value={counters.gsNetworkReady} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                    </Row>

                    <Row columns={16}>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="default"></Badge>
                                <Field label="None" value={counters.gsNone} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="warning"></Badge>
                                <Field label="Allocated" value={counters.gsAllocated} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="warning"></Badge>
                                <Field label="Wait to be Deleted" value={counters.gsWaitToBeDeleted} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px' }}>
                                <Badge color="success"></Badge>
                                <Field label="Maintaining" value={counters.gsMaintaining} style={{ fontSize: 'larger', fontWeight: 'bold' }} />
                            </Entity>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default ProjectOverview;
