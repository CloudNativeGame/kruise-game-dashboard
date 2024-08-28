import React, { useState } from 'react'
import { Modal, Input, Text, notify, Button,AutoComplete } from '@kubed/components'
import { Error } from '@kubed/icons'
import axios from 'axios';

export const OpsStateModal = ({visible, onCancel, onOk, resources,setvisible,loading }) => {
    const [fieldValue, setFieldValue] = useState("");

    const handlePatchRequest = async () => {
        const patchData = {
            spec: {
                opsState: fieldValue
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
          } catch (error) {
            notify.error(error);
            onOk(t("OpsState Updated"));
          }
    };

    const handleClick = async() => {
        await handlePatchRequest();
      };

    const title = (
        <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
          <Error />
          <Text>{t("Update OpsSate") }</Text>
        </div>
      )

    const footer = (
        <div>
          <Button variant="filled" color="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="filled" disabled={fieldValue===""} color="error" onClick={handleClick}>
            OK
          </Button>
        </div>
      )

  return (
    <div>
        <Modal
        title={title}
        visible={visible}
        width={500}
        closable={false}
        footer={footer}
        destroyOnClose={true}
        maskClosable={false}
        bodyStyle={{ pointerEvents: visible ? 'auto' : 'none' }}
        aria-hidden={!visible}
        >
            <AutoComplete placeholder="Set opsState..." style={{ width: "100%" }} options={[{ value: "WaitToBeDeleted" },{ value:"None" },{ value: "Allocated" },{ value: "Maintaining" },{ value: "Kill" } ]}  onChange={(data) => setFieldValue(data)}/>
        </Modal>
    </div>
  )
}