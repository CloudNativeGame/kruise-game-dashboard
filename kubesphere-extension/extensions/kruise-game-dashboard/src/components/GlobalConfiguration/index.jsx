import React, { useEffect, useState } from 'react';
import { Select, Button } from "@kube-design/components";
import { Text, Input, Container,notify } from '@kubed/components';
import styled from 'styled-components';
import axios from "axios";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 600px;
  margin-top: 20px; /* Add margin-top for spacing */
`;

const StyledSelect = styled(Select)`
  width: 600px;
  font-size: 1.5em; /* Make text larger */
`;

const StyledInput = styled(Input)`
  width: 600px;
  font-size: 1.2em; /* Make text larger */
`;

const StyledText = styled(Text)`
  font-size: 1.5em; /* Make text larger */
`;
const StyledOuterContainer = styled.div`
  margin-top: 50px;
`;

function GlobalConfiguration(props) {

  const [selectedValues, setSelectedValues] = useState([]);
  const [inputvalue, setinputvalue] = useState("");
  const [clusterOptions, setClusterOptions] = useState([]);
  const [config,setconfig]= useState(false)
  const [loading,setloading]=useState(false)

  const handleChange = (Value) => {
    setSelectedValues(Value);
  };

  const handleInputChange=(event)=>{
    setinputvalue(event.target.value)
  };

  const fetchClusters = async () => {
    try {
      const response = await axios.get('/kapis/tenant.kubesphere.io/v1alpha2/clusters');
      const clusterNames = (response.items !== undefined ? response.items : response.data.items).map(cluster => ({
        value: cluster.metadata.name,
        label: cluster.metadata.name
      }));
      setClusterOptions(clusterNames);
    } catch (error) {
      notify.error('Error fetching clusters:', error);
    }
  };
  const fetchConfig = async () => {
    setloading(true)
    try {
      const storedConfig = localStorage.getItem('config');
      if (storedConfig) {
        const configData = JSON.parse(storedConfig);
        setSelectedValues(JSON.parse(configData.deployUnits));
        setinputvalue(configData.projectLabel);
      }
      else{
        const response = await axios.get('/clusters/host/api/v1/namespaces/default/configmaps/configset');
        setSelectedValues(JSON.parse(response.data.deployUnits))
        setinputvalue(response.data.projectLabel)
        // Save config data to local storage
        const configData = {
          projectLabel: (response.data.projectLabel),
        deployUnits: (response.data.deployUnits)
        };
        localStorage.setItem('config', JSON.stringify(configData));
      }
      setconfig(true)
    } catch (error) {
      notify.error('Error fetching config:', error)
    }
    setloading(false)
  };

  const handleClick=async ()=>{
    if(!inputvalue.trim()){
      return notify.warning(t('Empty_Project_label'))
    }
    if(selectedValues.length === 0){
      return notify.warning(t('Select_One_DeployUnit'))
    }
    setloading(true)
    try{
      const configMap = {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: 'configset',
          namespace: 'default',
        },
        data: {
          'projectLabel': inputvalue,
          'deployUnits': JSON.stringify(selectedValues)
        },
      };
      if(config===true){
        try{
          await axios.put('/clusters/host/api/v1/namespaces/default/configmaps/configset', configMap)
          notify.success(t('Dashboard_Config_Updated'))

        }
        catch(error){
          await axios.post('/clusters/host/api/v1/namespaces/default/configmaps', configMap)
          notify.success(t('Dashboard_Config_Created'))
        }
      }
      else{
        await axios.post('/clusters/host/api/v1/namespaces/default/configmaps', configMap)
        notify.success(t('Dashboard_Config_Created'))
      }
      // Save config data to local storage
      const configData = {
        projectLabel: inputvalue,
        deployUnits: JSON.stringify(selectedValues)
      };
      localStorage.setItem('config', JSON.stringify(configData));
    } catch (error) {
      notify.error('Error creating ConfigMap:', error);
    }
    setloading(false)
  }

  useEffect(async ()=>{
    fetchClusters();
    fetchConfig();
},[])

  return (

    <StyledOuterContainer>
    <Container>
      <StyledText variant="h3">{t("Project_Label_Key")}</StyledText>
      <StyledInput value ={inputvalue} onChange={handleInputChange} placeholder={t("Select_Project_label")} disabled={loading} />
      <StyledText variant="h3">{t("Deploy_Units")}</StyledText>
      <StyledSelect
        name="select-multi"
        options={clusterOptions}
        onChange={handleChange}
        multi
        searchable
        value={selectedValues}
        placeholder={('name')}
        disabled={loading}
      />
      <ButtonWrapper>
        <Button type="primary" loading={loading} onClick={handleClick}>{("Save_Config")}</Button>
      </ButtonWrapper>
    </Container>
    </StyledOuterContainer>
  );
}

export default GlobalConfiguration;
