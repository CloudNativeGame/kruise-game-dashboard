import React, { useState } from 'react'
import { Modal, InputNumber, Text, Container, Button, notify } from '@kubed/components'
import { Update } from '@kubed/icons'
import axios from 'axios';

export const DPModal = ({ visible, onCancel, onOk, resources,setvisible,loading }) => {
  const [inputValue, setInputValue] = useState(0);
  const resourceNames = resources.map(resource => resource.Name);

  const handlePatchRequest = async () => {
    const patchData = {
        spec: {
            deletionPriority: inputValue
        }
    };
    const handlePatch= async (gs,clusterId,ns)=> {
        try{
             await axios.patch(
                '/clusters/' + clusterId + '/apis/game.kruise.io/v1alpha1/namespaces/'+ ns + '/gameservers/' + gs,
                patchData,
                {
                    headers: {
                        'Content-Type': 'application/merge-patch+json'
                    }
                }
            );
        } catch (error) {
            // console.error(`Error fetching data for cluster ${clusterId}:`, error);
          }
    }
    try {
      loading(true)
      setvisible(false)
      await Promise.all(resources.map(resource => handlePatch(resource.Name, resource.DeployUnit,resource.ns)));
      setInputValue(0)
      onOk(t("Resource DP Updated"));
    } catch (error) {
      notify.error(error);
      loading(false)
      }
};

  const handleClick = async() => {
    await handlePatchRequest();
  };

  const title = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
      <Update />
      <Text>{t("Update Resource Deletion Priority")}</Text>
    </div>
  )

  const message = `Enter the DP of gamservers ${resourceNames.join(', ')} to which you want to update.`;

  const handleChange = (value) => {
    setInputValue(value);
  };

  const footer = (
    <div>
      <Button variant="filled" color="default" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="filled" color="error" onClick={handleClick}>
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
        aria-hidden={!visible}
      >
        <Container style={{ margin: "10px"}}>
          <div>
            <Text>
              {message}
            </Text>
          </div>
          <div style={{ marginTop: "10px" ,marginBottom:"5px"}}>
            <InputNumber width={400} value={inputValue} min={0} onChange={handleChange} step={1} />
           </div>
        </Container>
      </Modal>
    </div>
  )
}
