import React, { useState, useEffect, useImperativeHandle, RefObject, forwardRef } from 'react';
import { CodeEditor } from '@kubed/code-editor';
import { useForceUpdate } from '@kubed/hooks';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import { Modal, notify, Input, Text, Button  } from '@kubed/components'
import axios from 'axios';
import yaml from 'js-yaml';
import { Pen } from "@kubed/icons";


export const EditModal = ({ visible, onCancel, onOk, resources,setvisible,loading }) => {
  const [_value, setValue] = useState(null);

    useEffect(() => {
        if (resources.length > 0) {
            const yamlString = yaml.dump(resources[0].currState);
        setValue(yamlString);
        }
    }, [resources]);

  const handleChange = (v) => {
    setValue(v);
  };


  const title = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: "5px" }}>
      <Pen />
      <Text>Edit YAML</Text>
    </div>
  )

  const handleSubmit=async ()=>{
    if(_value ===null || _value===""){
        notify.error("YAML file can not be empty")
    }


    try{
        loading(true)
        setvisible(false)
        const manifest = yaml.load(_value);
        await axios.put(`/clusters/${resources[0].DeployUnit}/apis/game.kruise.io/v1alpha1/namespaces/${resources[0].ns}/gameserversets/${resources[0].Name}`,manifest);
        onOk(t("Resource YAML Updated"));
    }
    catch(error){
        notify.error("Can not update YAML")
        loading(false)
    }
  }



const footer = (
    <div>
      <Button variant="filled" color="default" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="filled" color="error"  onClick={handleSubmit}  >
        OK
      </Button>
    </div>
  )



  return (

         <Modal
        visible={visible}
        title={title}
        width={800}
        closable={false}
        footer={footer}
        destroyOnClose={true}
        maskClosable={false}
        bodyStyle={{ pointerEvents: visible ? 'auto' : 'none' }}
        aria-hidden={!visible}
        >
        <CodeEditor
          // @ts-ignore
          onChange={handleChange}
          value={_value}

        />
      </Modal>
  );
};

