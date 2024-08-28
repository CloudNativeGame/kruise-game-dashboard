import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Pagination, Select } from "@kube-design/components";
import { Banner ,notify} from '@kubed/components';
import { Icon } from "@ks-console/shared";

const DeployUnitList=(props)=> {

  const [config, setConfig] = useState(null);
  const [DeployUnitsData, setDeployUnitsData] = useState([]);
  const [AllDeployUnitsData, setAllDeployUnitsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 5 });

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true)
    try {
      const storedConfig = localStorage.getItem('config');
      if (storedConfig) {
        const configData = JSON.parse(storedConfig);
        setConfig(configData);
      }
      else{
        const response = await axios.get('/clusters/host/api/v1/namespaces/default/configmaps/configset');
        setConfig(response.data);
        // Save config data to local storage
        const configData = {
          projectLabel: response.data.projectLabel,
          deployUnits: response.data.deployUnits
        };
        localStorage.setItem('config', JSON.stringify(configData));
      }
    } catch (error) {
        notify.error('Error fetching config:', error);
        setIsLoading(false)
    }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchDeployUnitsData = async () => {
      if (!config) return;
      const projectLabelKey = config.projectLabel;
      const deployUnits = JSON.parse(config.deployUnits);
      const fetchPromises = deployUnits.map(clusterId => fetchClusterData(clusterId, projectLabelKey));

      try {
        const results = await Promise.all(fetchPromises);
        const allData = results.filter(data => data); // Filter out any undefined values
        setAllDeployUnitsData(allData);
        setDeployUnitsData(allData.slice(0, pagination.limit));
        setPagination(prevState => ({
          ...prevState,
          total: allData.length,
        }));
      } catch (error) {
        notify.error(t("Error_fetching_Deployunit"))
        console.error('Error fetching deploy units data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployUnitsData();
  }, [config]);

  const fetchClusterData = async (clusterId, projectLabelKey) => {
    try {
      const gameServerSetsResponse = await axios.get(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/gameserversets`);
      const gameServerSets = gameServerSetsResponse.items || gameServerSetsResponse.data.items || [];
      let gameServerSetCount = 0;
      let gameServerCount = 0;
      const projects = [];

      gameServerSets.forEach(gss => {
        if (gss.metadata.labels && gss.metadata.labels[projectLabelKey]) {
          const projectName = gss.metadata.labels[projectLabelKey];
          if (!projects.includes(projectName)) {
            projects.push(projectName);
          }
          gameServerCount += gss.spec.replicas;
          gameServerSetCount++;
        }
      });

      return {
        DeployUnit: clusterId,
        gameServerSetCount,
        gameServerCount,
        projects: projects.join(', '),
      };
    } catch (error) {
      console.error(`Error fetching data for cluster ${clusterId}:`, error);
      return null;
    }
  };

  const handleTableChange = (e,Sorter ) => {
    const sortedData = sortData(AllDeployUnitsData, Sorter.field, Sorter.order);
    setAllDeployUnitsData(sortedData)
    setDeployUnitsData(sortedData.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit));
  };

  const sortData = (data, field, order) => {
    if (!field || !order) return data;
    const sortedData = [...data].sort((a, b) => {
      if (a[field] < b[field]) return order === 'ascend' ? -1 : 1;
      if (a[field] > b[field]) return order === 'ascend' ? 1 : -1;
      return 0;
    });
    return sortedData;
  };

  const options = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 50, label: 50 }
  ];

  const handleLimitChange = (limit) => {
    setPagination(prevState => ({
      ...prevState,
      limit: limit,
      page: 1,
    }));
    setDeployUnitsData(AllDeployUnitsData.slice(0, limit));
  };

  const handlePageChange = (page) => {
    setPagination(prevState => ({
      ...prevState,
      page: page,
    }));
    setDeployUnitsData(AllDeployUnitsData.slice((page - 1) * pagination.limit, page * pagination.limit));
  };

  const columns = [
    {
      title: t('DeployUnits'),
      dataIndex: 'DeployUnit',
      render: (value) => <Link to={`/clusters/${value}/kruise-game-dashboard`}>{value}</Link>,
    },
    {
      title: t('gameServerSetCount'),
      dataIndex: 'gameServerSetCount',
      // sorter: true,
    },
    {
      title: t('gameServerCount'),
      dataIndex: 'gameServerCount',
      // sorter: true,
    },
    {
      title: t('Projects'),
      dataIndex: 'projects',
      render: (projects) => projects || t('No_projects'),
    },
  ];

  const footer = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Pagination {...pagination} onChange={handlePageChange} />
      <div>
        <p>Total: {pagination.total}</p>
        <Select
          name="select"
          style={{ width: "60px" }}
          options={options}
          onChange={handleLimitChange}
          defaultValue={5}
        />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "10px" }}>
      <Banner
        className="mb12"
        icon={<Icon name="appcenter" size={40} />}
        title={t("DeployUnits")}
        description={t("deployUnits_description")}
      />
      <Table
        rowKey="DeployUnit"
        columns={columns}
        dataSource={DeployUnitsData}
        loading={isLoading}
        onChange={handleTableChange}
        footer={footer}
      />
    </div>
  );
}

export default DeployUnitList;
