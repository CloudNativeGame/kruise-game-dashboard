import React, { useState, useEffect } from 'react'
import { Modal, Input, Text, Container, Button, Checkbox,notify } from '@kubed/components'
import { Update } from '@kubed/icons'
import axios from 'axios';
import { Select } from '@kube-design/components'

export const UpdateResourceModal = ({ visible, onCancel, onOk, resources, setvisible, loading }) => {

    const [requestcpu, setrequestcpu] = useState("")
    const [requestmemory, setrequestmemory] = useState("")
    const [limitmemory, setlimitmemory] = useState("")
    const [limitcpu, setlimitcpu] = useState("")
    const [selectedContainer, setSelectedContainer] = useState("");
    const [commonContainers, setCommonContainers] = useState([]);
    const [checked, setchecked] = useState(false);

    useEffect(() => {
        const getCommonContainers = () => {
            const containerSets = resources.map(resource =>
                resource.currState.status.podStatus.containerStatuses.map(container => container.name)
            )
            const nonEmptyContainerSets = containerSets.filter(set => set.length > 0)
            if (nonEmptyContainerSets.length > 0) {
                const common = nonEmptyContainerSets.reduce((a, b) => a.filter(c => b.includes(c)), nonEmptyContainerSets[0])
                setCommonContainers(common)
            }
        }
        getCommonContainers()
    }, [resources])

    const HandleResourceUpdate = async () => {
        const HandleUpdate = async (gss, clusterId, ns, currState) => {
            try {
                const existingContainers = currState.spec.containers || [];
                const containerIndex = existingContainers.findIndex(container => container.name === selectedContainer);
                // Conditionally create or update the container properties
                if (containerIndex !== -1) {
                    // Container exists, update its resources
                    const existingContainer = existingContainers[containerIndex];

                    if (!existingContainer.resources) {
                        existingContainer.resources = {};
                    }
                    if (!existingContainer.resources.limits) {
                        existingContainer.resources.limits = {};
                    }
                    if (!existingContainer.resources.requests) {
                        existingContainer.resources.requests = {};
                    }
                    // Conditionally add non-empty resource limits and requests
                    if (limitcpu !== "") existingContainer.resources.limits.cpu = limitcpu;
                    if (limitmemory !== "") existingContainer.resources.limits.memory = limitmemory;
                    if (requestcpu !== "") existingContainer.resources.requests.cpu = requestcpu;
                    if (requestmemory !== "") existingContainer.resources.requests.memory = requestmemory;

                    if (Object.keys(existingContainer.resources.limits).length === 0) {
                        delete existingContainer.resources.limits;
                    }
                    if (Object.keys(existingContainer.resources.requests).length === 0) {
                        delete existingContainer.resources.requests;
                    }
                } else {
                    // Container does not exist, add a new container with the specified resources
                    const newContainer = {
                        name: selectedContainer,
                        resources: {
                            limits: {},
                            requests: {}
                        }
                    };

                    // Conditionally add non-empty resource limits and requests
                    if (limitcpu !== "") newContainer.resources.limits.cpu = limitcpu;
                    if (limitmemory !== "") newContainer.resources.limits.memory = limitmemory;
                    if (requestcpu !== "") newContainer.resources.requests.cpu = requestcpu;
                    if (requestmemory !== "") newContainer.resources.requests.memory = requestmemory;

                    // Remove empty resource objects if no limits or requests are specified
                    if (Object.keys(newContainer.resources.limits).length === 0) {
                        delete newContainer.resources.limits;
                    }
                    if (Object.keys(newContainer.resources.requests).length === 0) {
                        delete newContainer.resources.requests;
                    }

                    existingContainers.push(newContainer);
                }

                // Create the patch data
                const patchData = {
                    spec: {
                        containers: existingContainers
                    }
                };

                // Apply the patch
                await axios.patch(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/namespaces/${ns}/gameservers/${gss}`, patchData, { headers: { 'Content-Type': 'application/merge-patch+json' } });

            } catch (error) {
            }
        }
        try {
            await Promise.all(resources.map(resource => HandleUpdate(resource.Name, resource.DeployUnit, resource.ns, resource.currState)));
        } catch (error) {
            notify.error(error);
        }

    }

    const HandlePodDelete = async () => {
        const HandleDelete = async (gs, clusterId, ns) => {
            try {

                await axios.delete(`/clusters/${clusterId}/api/v1/namespaces/${ns}/pods/${gs}`)
            } catch (error) {
            }
        };
        try {
            await Promise.all(resources.map(resource => HandleDelete(resource.Name, resource.DeployUnit, resource.ns)));
        } catch (error) {
            notify.error( error);
        }

    }

    const handleClick = async () => {
        setvisible(false)
        loading(true)
        await HandleResourceUpdate();
        if (checked) {
            await HandlePodDelete();
        }
        onOk(t("Resource Updated"));
    };
    const resourceNames = resources.map(resource => resource.Name);

    const handleContainerChange = (value) => {
        setSelectedContainer(value)
    }

    const footer = (
        <div>
            <Button variant="filled" color="default" onClick={onCancel}>
                Cancel
            </Button>
            <Button variant="filled" color="error" disabled={selectedContainer === ""} onClick={handleClick} >
                OK
            </Button>
        </div>
    )
    const message = `Update the requests and limits for the gameservers ${resourceNames.join(', ')} .`;

    const title = (
        <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
            <Update />
            <Text>{resources.length > 1 ? "Update Multiple Resources" : "Update Resource"}</Text>
        </div>
    )

    return (
        <div>
            <Modal
                visible={visible}
                title={title}
                width={500}
                closable={false}
                footer={footer}
                destroyOnClose={true}
                maskClosable={false}
                bodyStyle={{ pointerEvents: visible ? 'auto' : 'none' }}
                aria-hidden={!visible}
            >
                <Container style={{ margin: "5px" }}>
                    <Text>
                        {message}
                    </Text>
                    <div style={{ marginTop: "10px", marginBottom: "5px" }}>
                        <Text style={{ fontWeight: "bold" }}>{t("Container Name")}</Text>
                        <Select
                            style={{ width: '440px' }}
                            placeholder={("Select Container")}
                            options={commonContainers.map(container => ({ value: container, label: container }))}
                            value={selectedContainer}
                            onChange={handleContainerChange}
                        />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <Text style={{ fontWeight: "bold" }}>Request:</Text>
                        <div style={{ marginLeft: "20px", width: "90%" }}>
                            <Text>Cpu</Text>
                            <Input placeholder={t("update request Cpu ")} onChange={(e) => { setrequestcpu(e.target.value) }} />
                            <Text>Memory</Text>
                            <Input placeholder={t('update request memory' )}onChange={(e) => { setrequestmemory(e.target.value) }} />
                        </div>
                    </div>
                    <div>
                        <Text style={{ fontWeight: "bold" }}>Limit:</Text>
                        <div style={{ marginLeft: "20px", width: "90%" }}>
                            <Text>Cpu</Text>
                            <Input placeholder={t('update limit cpu')} onChange={(e) => { setlimitcpu(e.target.value) }} />
                            <Text>Memory</Text>
                            <Input placeholder={t('update limit memory')} onChange={(e) => { setlimitmemory(e.target.value) }} />
                        </div>
                    </div>
                    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Checkbox label={t("Select to Recreate the pod ")} checked={checked} onChange={()=>{setchecked(!checked)}} />
                    </div>
                </Container>
            </Modal>
        </div>
    )
}
