import React, { useState, useEffect, useImperativeHandle, RefObject, forwardRef } from 'react';
import { CodeEditor } from '@kubed/code-editor';
import ReactFileReader from 'react-file-reader';
import { Download, Upload } from '@kubed/icons';
import { useForceUpdate } from '@kubed/hooks';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import {  ActionWrapper, Divider } from './style';
import { Button,Select } from "@kube-design/components";
import { notify } from '@kubed/components'
import axios from 'axios';
import yaml from 'js-yaml';


const Resource = () => {
  const forceUpdate = useForceUpdate();
  const [_value, setValue] = useState("");
  const [loading,setloading]=useState(false)
  const [selectedValues, setSelectedValues] = useState([]);
  const [clusterOptions, setClusterOptions] = useState([]);

  const saveAsFile = (text = '', fileName) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName);
  };

  const handleChange = (v) => {
    setValue(v);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!isEmpty(e.target.result)) {
        const v = (e.target.result);
        setValue(v);
        forceUpdate();
      }
    };
    reader.readAsText(file[0]);
  };

  const fetchClusters = async () => {
    try {
      const response = await axios.get('/kapis/tenant.kubesphere.io/v1alpha2/clusters');
      const clusterNames = (response.items || response.data.items || []).map(cluster => ({
        value: cluster.metadata.name,
        label: cluster.metadata.name
      }));
      setClusterOptions(clusterNames);
      setSelectedValues([clusterNames[0].value]);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
  };

  useEffect(async ()=>{
    fetchClusters();
},[])

  const handleDownload = () => {
    const downloadValue = onDownload(_value);
    saveAsFile(downloadValue, _fileName);
  };

  const handleSelect=(Value)=>{
    setSelectedValues(Value);
  }

  const handleSubmit = async () => {
    if (selectedValues.length === 0) {
      notify.error(t("Empty_DeployUnits"));
      return;
    }

    try {
      setloading(true);
      const manifest = yaml.load(_value);
      const { kind, metadata, apiVersion } = manifest;
      const namespace = metadata.namespace || 'default';

      const requests = selectedValues.map((cluster) => {
        let url;
        switch (kind) {
          case 'GameServerSet':
            url = `/clusters/${cluster}/apis/${apiVersion}/namespaces/${namespace}/gameserversets`;
            break;
          case 'GameServer':
            url = `/clusters/${cluster}/apis/${apiVersion}/namespaces/${namespace}/gameservers`;
            break;
          case 'Deployment':
            url = `/clusters/${cluster}/apis/${apiVersion}/namespaces/${namespace}/deployments`;
            break;
          case 'StatefulSet':
            url = `/clusters/${cluster}/apis/${apiVersion}/namespaces/${namespace}/statefulsets`;
            break;
          case 'DaemonSet':
            url = `/clusters/${cluster}/apis/${apiVersion}/namespaces/${namespace}/daemonsets`;
            break;
          default:
            throw new Error('Unsupported resource kind');
        }

        return axios.post(url, manifest);
      });

      await Promise.all(requests);
      notify.success('Resource created successfully in all selected clusters');
    } catch (error) {
      console.error('Error creating resource:', error);
      notify.error('Error creating resource:', error);
    } finally {
      setloading(false);
    }
  };


  const renderActions = () => {
    return (
      <ActionWrapper>
          <ReactFileReader fileTypes={['.yaml']} handleFiles={handleUpload}>
            <Upload fill="#fff" color="#fff" size={20} />
          </ReactFileReader>

         <Divider>|</Divider>
        <Download fill="#fff" color="#fff" size={20} onClick={handleDownload} />
      </ActionWrapper>
    );
  };


  return (
    <div>
      <div style={{marginBottom:"10px"}}>
      <Select
        name="select-multi"
        options={clusterOptions}
        onChange={handleSelect}
        multi
        value={selectedValues}
        placeholder={("Select_DeployUnits")}
        disabled={loading}
      />
        </div>
        <CodeEditor
          // @ts-ignore
          onChange={handleChange}
          value={_value}

        />
        {renderActions()}
      <div style={{marginTop:"20px",display:"flex",justifyContent:"center"}}>
        <Button type="primary" loading={loading} onClick={handleSubmit}>
            Submit
          </Button>
      </div>
    </div>
  );
};

export default Resource;
