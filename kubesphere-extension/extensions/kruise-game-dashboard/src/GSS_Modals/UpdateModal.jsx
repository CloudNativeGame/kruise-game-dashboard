import React, { useState ,useEffect} from 'react'
import { Modal, Input, Text, Container, Button, notify } from '@kubed/components'
import { Update } from '@kubed/icons'
import axios from 'axios';
import {Select} from '@kube-design/components'

export const UpdateModal = ({ visible, onCancel, onOk, resources,setvisible,loading }) => {

  const [inputValue, setInputValue] = useState("");
  const [selectedContainer, setSelectedContainer] = useState("");
  const [commonContainers, setCommonContainers] = useState([]);
  const resourceNames = resources.map(resource => resource.Name);

  useEffect(() => {
    const getCommonContainers = () => {
      const containerSets = resources.map(resource =>
        resource.currState.spec.gameServerTemplate.spec.containers.map(container => container.name)
      )
      const nonEmptyContainerSets = containerSets.filter(set => set.length > 0)
      if (nonEmptyContainerSets.length > 0) {
        const common = nonEmptyContainerSets.reduce((a, b) => a.filter(c => b.includes(c)), nonEmptyContainerSets[0])
        setCommonContainers(common)
      }
    }
    getCommonContainers()
  }, [resources])

  const fetchGameServerSets = async () => {
    const fetchClusterData = async (gss,clusterId,ns,currState) => {
        try {
          // Find the container to update by name and update its image
          const updatedContainers = currState.spec.gameServerTemplate.spec.containers.map(container => {
            if (container.name === selectedContainer) {
              return {
                ...container,
                image: inputValue
              };
            }
            return container;
          });

          const patchData = {
            spec: {
              gameServerTemplate: {
                spec: {
                  containers: updatedContainers
                }
              }
            }
          };
        await axios.patch(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/namespaces/${ns}/gameserversets/${gss}`,patchData,{ headers: { 'Content-Type': 'application/merge-patch+json' } })
      } catch (error) {
      }
    };
    try {
      loading(true)
      setvisible(false)
      await Promise.all(resources.map(resource => fetchClusterData(resource.Name, resource.DeployUnit,resource.ns,resource.currState)));
      setInputValue("")
      setSelectedContainer("")
      onOk(t("Resource Image Updated"));
    } catch (error) {
      notify.error(error);
      loading(false);
    }
  };

  const handleClick = async() => {
    await fetchGameServerSets();
  };

  const title = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
      <Update />
      <Text>{resources.length > 1 ? t("Update Multiple Resources") : t("Update Resource")}</Text>
    </div>
  )

  const message = `Enter the Name & Image for gamserversets ${resourceNames.join(', ')} which you want to update.`;

  const handleImageChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const footer = (
    <div>
      <Button variant="filled" color="default" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="filled" color="error" disabled={inputValue==="" || selectedContainer===""} onClick={handleClick}>
        OK
      </Button>
    </div>
  )

  const handleContainerChange = (value) => {
    setSelectedContainer(value)
  }

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
        <Container style={{ margin: "10px"}}>
          <div>
            <Text>
              {message}
            </Text>
          </div>
          <div style={{ marginTop: "10px" ,marginBottom:"5px"}}>
          <Text>{t("Container Name")}</Text>
          <Select
              style={{ width: '440px' }}
              placeholder={("Select Container")}
              options={commonContainers.map(container => ({ value: container, label: container }))}
              value={selectedContainer}
              onChange={handleContainerChange}
            />
            </div>
          <Text>{t("Update Image")}</Text>
            <Input placeholder="Update Gameserver Image ..." value={inputValue} onChange={handleImageChange} />
        </Container>
      </Modal>
    </div>
  )
}
