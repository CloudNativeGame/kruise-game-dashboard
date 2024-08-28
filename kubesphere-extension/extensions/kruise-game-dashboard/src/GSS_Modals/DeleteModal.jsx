import React, { useState } from 'react'
import { Modal, Input, Text, Container, Button, notify } from '@kubed/components'
import { Error } from '@kubed/icons'
import axios from 'axios';


export const DeleteModal = ({ visible, onCancel, onOk, resources,setvisible,loading,gss }) => {
  const [inputValue, setInputValue] = useState("");
  const resourceNames = resources.map(resource => resource.Name);

  const DeleteResources = async () => {
    const DeleteResource = async (resource_name,clusterId,ns) => {
      try {
        await axios.delete(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/namespaces/${ns}/${gss===true?"gameserversets":"gameservers"}/${resource_name}`)
      } catch (error) {
      }
    };
    try {
      loading(true)
      setvisible(false)
      await Promise.all(resources.map(resource => DeleteResource(resource.Name, resource.DeployUnit,resource.ns)));
      setInputValue("")
      onOk(t("Resource Deleted"));
    } catch (error) {
      loading(false)
      notify.error(error);
    }
  };

  const handleClick = async() => {
    await DeleteResources();
  };

  const title = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
      <Error />
      <Text>{resources.length > 1 ? t("Delete Multiple Resources") : t("Delete Resource")}</Text>
    </div>
  )

  const message = `Enter the ${gss===true?t("gamserversets"):t("gameservers")} names ${resourceNames.join(', ')} to confirm that you understand the risks of this operation.`;

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const footer = (
    <div>
      <Button variant="filled" color="default" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="filled" color="error" disabled={`${resourceNames.join(', ')}`===inputValue?false:true} onClick={handleClick}>
        OK
      </Button>
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
        data-modal-content // Use this to manage focus
        tabIndex={-1} // Ensure the modal can be focused
      >
        <Container style={{ margin: "10px" }}>
          <div>
            <Text>
              {message}
            </Text>
          </div>
          <div style={{ marginTop: "10px" }}>
            <Input placeholder={`${resourceNames.join(', ')}`} value={inputValue} onChange={handleChange} />
          </div>
        </Container>
      </Modal>
    </div>
  )
}
