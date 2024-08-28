import React, { useState, useEffect } from 'react'
import { Modal, Input, Text, Container, Button, Checkbox, notify} from '@kubed/components'
import { Update } from '@kubed/icons'
import axios from 'axios';
import { Select } from '@kube-design/components'

export const UpdateModal = ({ visible, onCancel, onOk, resources, setvisible, loading }) => {

  const [inputValue, setInputValue] = useState("");
  const [selectedContainer, setSelectedContainer] = useState("");
  const [commonContainers, setCommonContainers] = useState([]);
  const [checked, setchecked] = useState(false)
  const resourceNames = resources.map(resource => resource.Name);

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

  const HandleImageUpdate = async () => {
    const HandleUpdate = async (gss, clusterId, ns,currState) => {
      try {

        const existingContainers = currState.spec.containers || [];
        const containerIndex = existingContainers.findIndex(container => container.name === selectedContainer);

        // Update or add the container
        if (containerIndex !== -1) {
          // Update the existing container's image
          existingContainers[containerIndex].image = inputValue;

        } else {
          // Add a new container
          existingContainers.push({
            name: selectedContainer,
            image: inputValue
          });
        }

        // Create the patch data
        const patchData = {
          spec: {
            containers: existingContainers
          }
        };
        await axios.patch(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/namespaces/${ns}/gameservers/${gss}`, patchData, { headers: { 'Content-Type': 'application/merge-patch+json' } })
      } catch (error) {
        // console.error(`Error fetching data for cluster ${clusterId}:`, error);
      }
    };
    try {
      await Promise.all(resources.map(resource => HandleUpdate(resource.Name, resource.DeployUnit, resource.ns,resource.currState)));
    } catch (error) {
      notify.error(error);
    }
  };

  const HandlePodDelete= async ()=>{
    const HandleDelete=async(gs, clusterId, ns)=>{
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
    await HandleImageUpdate();
    setInputValue("")
    setSelectedContainer("")
    if(checked){
      await HandlePodDelete();
    }
    onOk(t("Image Updated"));
  };

  const title = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
      <Update />
      <Text>{resources.length > 1 ? "Update Multiple Resources" : "Update Resource"}</Text>
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
      <Button variant="filled" color="error" disabled={inputValue === "" || selectedContainer === ""} onClick={handleClick}>
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
        <Container style={{ margin: "10px" }}>
          <div>
            <Text>
              {message}
            </Text>
          </div>
          <div style={{ marginTop: "10px", marginBottom: "5px" }}>
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
          <div style={{ marginTop: "5px", marginBottom: "5px" }}>
            <Checkbox label={t("Select to Recreate the pod ")} checked={checked} onChange={()=>{setchecked(!checked)}} />
          </div>
        </Container>
      </Modal>
    </div>
  )
}
