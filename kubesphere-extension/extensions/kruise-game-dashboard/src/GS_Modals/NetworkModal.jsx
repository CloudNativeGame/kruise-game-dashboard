import React, { useState } from 'react'
import { Modal, Input, Text, Container, Button,Select ,notify} from '@kubed/components'
import { Error } from '@kubed/icons'
import axios from 'axios';

export const NetworkModal = ({visible, onCancel, onOk, resources,setvisible,loading }) => {
    const [fieldValue, setFieldValue] = useState("");

    const handleNeworkRequest = async () => {
        const patchData = {
            spec: {
                networkDisabled: fieldValue
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
                // notify.error(error);
              }
        }
        try {
          loading(true)
          setvisible(false)
          await Promise.all(resources.map(resource => handlePatch(resource.Name, resource.DeployUnit,resource.ns)));
          onOk(t("NetworkState Updated"));
        } catch (error) {
          notify.error(error);
          loading(false)
          }
    };

    const handleClick = async() => {
        await handleNeworkRequest();
      };

    const title = (
        <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
          <Error />
          <Text>{t("Set_NetworkDisabled") }</Text>
        </div>
      )

    const footer = (
        <div>
          <Button variant="filled" color="default" onClick={()=>{setFieldValue("") ;onCancel()}}>
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
            <Select placeholder="Set Network..." style={{ width: "100%" }} options={[{ value: true,label:"True" },{ value:false,label: "False" } ]}  onChange={(data) => setFieldValue(data)}/>

        </Modal>
    </div>
  )
}