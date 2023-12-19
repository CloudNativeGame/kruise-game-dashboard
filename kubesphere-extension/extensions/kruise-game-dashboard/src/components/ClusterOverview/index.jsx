// Display GameServerSets summary on dashboard
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {Badge, Banner, Col, Entity, Field, Row,} from '@kubed/components';
import {Icon} from "@ks-console/shared";


function ClusterOverview(props) {

    let params = useParams();
    let clusterId = params.name;
    let [gameServerSets, setGameServerSets] = useState([]);
    let [gameServers, setGameServers] = useState([]);


    // load data from apiServer and set to state
    useEffect(() => {
        axios.get('clusters/' + clusterId + '/apis/game.kruise.io/v1alpha1/gameserversets')
            .then(response => {
                setGameServerSets(response.items)
            });
        axios.get('clusters/' + clusterId + '/apis/game.kruise.io/v1alpha1/gameservers')
            .then(response => {
                setGameServers(response.items)
            });
    }, []);

    let gsCreating = 0;
    let gsUpdating = 0;
    let gsDeleting = 0;
    let gsReady = 0;
    let gsNotReady = 0;
    let gsNetwork = 0;
    let gsNetworkReady = 0;
    let gsNone = 0;
    let gsAllocated = 0;
    let gsWaitToBeDeleted = 0;
    let gsMaintaining = 0;

    for (let i = 0; i < gameServers.length; i++) {
        if (gameServers[i].status.currentState === "Creating") {
            gsCreating = gsCreating + 1;
        }
        if (gameServers[i].status.currentState === "Updating") {
            gsUpdating = gsUpdating + 1;
        }
        if (gameServers[i].status.currentState === "Deleting") {
            gsDeleting = gsDeleting + 1;
        }
        if (gameServers[i].status.currentState === "Ready") {
            gsReady = gsReady + 1;
        }
        if (gameServers[i].status.currentState === "NotReady") {
            gsNotReady = gsNotReady + 1;
        }
        if (gameServers[i].status.networkStatus.networkType !== undefined) {
            gsNetwork = gsNetwork + 1;
        }
        if (gameServers[i].status.networkStatus.currentNetworkState === "Ready") {
            gsNetworkReady = gsNetworkReady + 1;
        }
        if (gameServers[i].spec.opsState === "None") {
            gsNone = gsNone + 1;
        }
        if (gameServers[i].spec.opsState === "Allocated") {
            gsAllocated = gsAllocated + 1;
        }
        if (gameServers[i].spec.opsState === "Maintaining") {
            gsMaintaining = gsMaintaining + 1;
        }
        if (gameServers[i].spec.opsState === "WaitToBeDeleted") {
            gsWaitToBeDeleted = gsWaitToBeDeleted + 1;
        }
    }

    return (
        <>
            <Row columns={20}>
                <Col span={16}>
                    <Banner
                        icon={<Icon name="application" size={20}/>}
                        title={t("gs_overview")}
                        description={t("gameservers_description")}
                    />
                </Col>
            </Row>

            <Row columns={20}>
                <Col span={16} style={{ background: 'white', borderRadius: '5px'}}>
                    <Row columns={16}>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="default"></Badge>
                                <Field label={t("num_total")} value={gameServers.length} style={{fontSize: 'larger', fontWeight: 'bold'}} />
                            </Entity>
                        </Col>
                        <Col span={4} >
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="warning"></Badge>
                                <Field label={t("num_creating")} value={gsCreating} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="warning"></Badge>
                                <Field label={t("num_updating")} value={gsUpdating} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="error"></Badge>
                                <Field label={t("num_deleting")} value={gsDeleting} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                    </Row>

                    <Row columns={16}>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="success"></Badge>
                                <Field label={t("num_ready")} value={gsReady} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="warning"></Badge>
                                <Field label={t("num_notReady")} value={gsNotReady} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="default"></Badge>
                                <Field label={t("num_network")} value={gsNetwork} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="success"></Badge>
                                <Field label={t("num_network_ready")} value={gsNetworkReady} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                    </Row>

                    <Row columns={16}>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="default"></Badge>
                                <Field label={t("num_none")} value={gsNone} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="warning"></Badge>
                                <Field label={t("num_allocated")} value={gsAllocated} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="warning"></Badge>
                                <Field label={t("num_waitToBeDeleted")} value={gsWaitToBeDeleted} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                        <Col span={4}>
                            <Entity bordered={false} style={{ background: 'white', borderRadius: '10px'}}>
                                <Badge color="error"></Badge>
                                <Field  label={t("num_maintaining")} value={gsMaintaining} style={{fontSize: 'larger', fontWeight: 'bold'}}/>
                            </Entity>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}


export default ClusterOverview;