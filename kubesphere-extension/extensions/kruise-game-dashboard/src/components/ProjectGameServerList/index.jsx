import React, { useEffect, useState } from 'react';
import { Button, FilterInput, Menu, MenuItem, MenuLabel, Dropdown, Field,Banner, notify } from '@kubed/components';
import { Refresh, Cogwheel, Eye, EyeClosed, Trash, Pen } from "@kubed/icons";
import { Table, Pagination, Select } from "@kube-design/components";
import {  useParams } from 'react-router-dom';
import { Avatar, Icon, } from "@ks-console/shared";
import axios from 'axios';
import { ToolbarWrapper, ToolbarInner, BatchActions } from '../ProjectGameServerSetList/style.jsx';
import {OpsStateModal} from '../../GS_Modals/OpsStateModal.jsx'
import { NetworkModal } from '../../GS_Modals/NetworkModal.jsx';
import { DeleteModal } from '../../GSS_Modals/DeleteModal.jsx';
import { UpdateModal } from '../../GS_Modals/UpdateModal.jsx';
import { UpdateResourceModal } from '../../GS_Modals/UpdateResourceModal.jsx';
import { UPModal } from '../../GS_Modals/UPModal.jsx';
import { DPModal } from '../../GS_Modals/DPModal.jsx';

const PAGINATION_OPTIONS = [5, 10, 50];

const ProjectGameServerList = () => {

  const COLUMNS = [
    { title: t('name'), dataIndex: 'Name',  canHide: true, isVisible: true,render: (value, record) => (  <Field    label={record.namespace || "-"}  value={record.Name}  />), },
    { title: t('deployUnit'), dataIndex: 'DeployUnit', searchable: true, canHide: true, isVisible: true },
    { title: t('state'), dataIndex: 'state',  canHide: true, isVisible: true },
    { title: t('opsState'), dataIndex: 'opsState',  canHide: true, isVisible: true},
    { title: t('networkState'), dataIndex: 'networkState', isVisible: true,canHide: true },
    { title: t('images'), dataIndex: 'images', isVisible: true ,canHide: true ,render: (value, record) => (<>{value?.map((item, index) => {return (<Field key={index} value={item[0] + " -> " + item[1]}/>)})}</>),},
    { title: t('conditions'), dataIndex: 'conditions', isVisible: false,canHide: true,render: (value, record) => (<>{value?.map((item, index) => {  return (  <Field  key={index}  value={item.key + ":" + item.value}  />  )  })}  </>), },
    { title: t('DP'), dataIndex: 'DP', isVisible: false,canHide: true, },
    { title: t('labels'), dataIndex: 'labels', isVisible: false,canHide: true,render: (value, record) => (<>  {value?.map((item, index) => {  return (  <Field key={index}  value={item.key + "=" + item.value}  />  )  })}  </>), },
    { title: t('UP'), dataIndex: 'UP', isVisible: false,canHide: true },
    { title: t('Resources'), dataIndex: 'Resources', isVisible: false,canHide: true,render: (value, record) => (<>{value?.map((item, index) => {return (<Field  key={index}  value={item.key + " -> " + item.value}  />  )  })}  </>), },
    { title: t('annotations'), dataIndex: 'annotations', isVisible: false,canHide: true ,render: (value, record) => (  <>{value?.map((item, index) => { return ( <Field   key={index}   value={item.key + "=" + item.value}/>) })}  </>),},
    { title: t('creationTimestamp'), dataIndex: 'creationTimestamp', isVisible: false,canHide: true },
    { title: t('actions'), dataIndex: 'more', isVisible: true, width: 58, render: (value, record) => (
      <>
          <Dropdown content={
              <Menu>
                  <MenuItem icon={<Pen/>} onClick={()=>{setresources([{Name:record.Name,DeployUnit:record.DeployUnit,ns:record.namespace,currState:record.currState}]),showUpdateModal()}}>Update image</MenuItem>
                  <MenuItem icon={<Trash/>} onClick={()=>{setresources([{Name:record.Name,DeployUnit:record.DeployUnit,ns:record.namespace,currState:record.currState}]),showDeleteModal()}}>Delete</MenuItem>
              </Menu>
          }>
              <Button variant="text" radius="lg">
                  <Avatar icon={<Icon name="more"/>} description={" "}/>
              </Button>
          </Dropdown>
      </>
  )}
  ];

  const [filter, setFilter] = useState([]);
  const [config, setConfig] = useState({ deployUnits: [], projectLabel: "" });
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 5 });
  const [allData, setAllData] = useState([]);
  const [Data,setData] =useState([])
  const [deployUnits, setDeployUnits] = useState([]);
  const [defaultdeploy, setdefaultdeploy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState(COLUMNS);
  const [reload,setreload] =useState(false)
  const [IsDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [IsUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [IsResourceModal, setIsResourceModal] = useState(false);
  const [IsOpsStateModal, setIsOpsStateModal] = useState(false);
  const [IsNetworkModal, setIsNetworkModal] = useState(false);
  const [IsUPModal, setUPModal] = useState(false);
  const [IsDPModal, setDPModal] = useState(false);
  const [resources,setresources]=useState([]);

  const { projectId } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const storedConfig = localStorage.getItem('config');
        if (storedConfig) {
          const configData = JSON.parse(storedConfig);
          if (isMounted) {
            setConfig({ projectLabel: configData.projectLabel, deployUnits: JSON.parse(configData.deployUnits) });
            const deployunit=JSON.parse(configData.deployUnits);
            if(deployunit.length>0){
              setDeployUnits([deployunit[0]]);
              setdefaultdeploy(deployunit[0])
            }
          }
        } else {
          const response = await axios.get('/clusters/host/api/v1/namespaces/default/configmaps/configset');
          if (isMounted) {
            setConfig({ projectLabel: response.data.projectLabel, deployUnits: JSON.parse(response.data.deployUnits) });
            const deployunit=JSON.parse(response.data.deployUnits);
            if(deployunit.length>0){
              setDeployUnits([deployunit[0]]);
              setdefaultdeploy(deployunit[0])
            }
            localStorage.setItem('config', JSON.stringify(response.data));
          }
        }
      } catch (error) {
        notify.error('Error fetching config:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchGameServers = async () => {
      const fetchClusterData = async (clusterId) => {
        try {
          const filterParams = new URLSearchParams({
            labelSelector: `${config.projectLabel}=${projectId}`
          }).toString();
          const response = await axios.get(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/gameservers?${filterParams}`)
          return response.items !== undefined ? response.items : response.data.items;
        } catch (error) {
          notify.error(`Error fetching data for cluster ${clusterId}:`, error);
          return [];
        }
      };

      try {
        setIsLoading(true);
        const results = await Promise.all(deployUnits.map(fetchClusterData));
        const ProjectGameServerList = []
        results.forEach((gameServers, index) => {
          const clusterId = deployUnits[index];
          gameServers.forEach(item => {
            let row = {
              id: item.metadata.uid,
              Name: item.metadata.name,
              namespace: item.metadata.namespace,
              creationTimestamp: item.metadata.creationTimestamp,
              labels: Object.values(getItems(item.metadata.labels)),
              annotations: Object.values(getItems(item.metadata.annotations)),
              opsState: item.spec.opsState,
              state: item.status.currentState,
              networkState: item.status.networkStatus.currentNetworkState,
              DP: item.status.deletionPriority,
              UP: item.status.updatePriority,
              images: (getImages(item.status.podStatus.containerStatuses)),
              conditions: Object.values(getConditions(item.status.conditions)),
              Resources:(getResources(item.spec.containers)),
              DeployUnit: clusterId,
              currState: item,
            };
            ProjectGameServerList.push(row)
          })

        })
        if (isMounted) {
          setAllData(ProjectGameServerList);
          setData(ProjectGameServerList.slice(0, pagination.limit))
          setPagination(prevState => ({...prevState,page:1,total: ProjectGameServerList.length}));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (config.deployUnits.length > 0) {
      fetchGameServers();
    }

    return () => {
      isMounted = false;
    };

  }, [config, deployUnits, projectId,reload]);

  function getItems(items) {
    const kvs = []
    if (items == undefined) return []

    for (let key in items) {
      if (key.includes("kubectl.kubernetes.io/last-applied-configuration")) {
        continue
      }
      kvs.push({key: key,value: items[key]})
    }
    return kvs
  }

  function getConditions(items) {
    const kvs = []
    if (items == undefined) {
        return []
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i].status === "False") {
            kvs.push(
                {
                    key: items[i].type,
                    value: items[i].status,
                }
            )
        }
    }
    return kvs
}

function getResources(items) {
    const kvs = []
    if (items == undefined) return []
    for (let i = 0; i < items.length; i++) {
      let cpuRequest = items[i].resources?.requests?.cpu || '';
      let memRequest = items[i].resources?.requests?.memory || '';
      let cpuLimit = items[i].resources?.limits?.cpu || '';
      let memLimit = items[i].resources?.limits?.memory || '';
      let v = cpuRequest + " / " + memRequest + " / " + cpuLimit + " / " + memLimit;
      kvs.push(
        {
          key: items[i].name,
          value: v,
        }
      )
    }
    return kvs
  }

  function getImages(items) {
    const kvs = []
    if (items == undefined) { return [] }
    for (let i = 0; i < items.length; i++) {
      kvs.push([items[i].name,items[i].image])
    }
    return kvs
  }

  function filterData(data, filters) {
    return data.filter(item => {
      return filters.every(filter => item[filter.id].includes(filter.value));
    });
  }

  const handleFilterChange = (value) => {
    const newFilters = Object.keys(value).map(item => ({id: item,value: value[item]}));
    setFilter(getFilters(newFilters));
    if(newFilters.length===0){
      setreload(!reload)
    }
    else{
      const filtered_Output=filterData(allData,newFilters)
      setAllData(filtered_Output)
      setData(filtered_Output.slice(0, pagination.limit))
      setPagination(prevState => ({...prevState,total: filtered_Output.length}));
    }
  };

  function getFilters(filters) {
    const formatFilters = {};
    filters.forEach(item => {formatFilters[item.id] = item.value;});
    return formatFilters;
  }

  const handleDeployUnitChange = (value) => {
    setDeployUnits(value === 'AllDeployunits' ? config.deployUnits : [value]);
    setdefaultdeploy(value)
  };

  const handlePageChange = (page) => {
    setPagination(p => ({ ...p, page }));
    const newData = allData.slice((page - 1) * pagination.limit, page * pagination.limit);
    setData(newData);
  };

  const handleLimitChange = (limit) => {
    setPagination(prevState => ({
      ...prevState,
      limit: limit,
      page: 1,
    }));
    setData(allData.slice(0, limit))
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };
  const showOpsStateModal = () => {
    setIsOpsStateModal(true);
  };

  const showNetworkModal = () => {
    setIsNetworkModal(true);
  };
  const showResourceModal = () => {
    setIsResourceModal(true);
  };
  const showUPModal = () => {
    setUPModal(true);
  };
  const showDPModal = () => {
    setDPModal(true);
  };

  const handleCancel = () => {
    setIsUpdateModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsOpsStateModal(false)
    setIsNetworkModal(false)
    setIsResourceModal(false)
    setUPModal(false)
    setDPModal(false)
  }

  const handleOk = (value) => {
    handleCancel();
    setreload(!reload)
    setSelectedRowKeys([])
    notify.success(value)

  };

  const refetch = () => {
    setFilter([])
    setreload(!reload)
  };

  const toggleColumnVisibility = (dataIndex) => {
    setColumns(cols => cols.map(col => (
      col.dataIndex === dataIndex ? { ...col, isVisible: !col.isVisible } : col
    )));
  };

  const settingMenu = (
    <Menu width={200} style={{ backgroundColor: 'rgb(36, 46, 66)' }} className="menu-setting">
      <MenuLabel style={{ color: 'white' }}>Custom Columns</MenuLabel>
      {columns.filter(col => col.canHide).map(col => (
        <MenuItem
          key={col.dataIndex}
          style={{ color: 'white' }}
          icon={col.isVisible ? <Eye /> : <EyeClosed />}
          onClick={() => toggleColumnVisibility(col.dataIndex)}
        >
          {col.dataIndex}
        </MenuItem>
      ))}
    </Menu>
  );

  const handleTableChange = (filters, Sorter) => {
    const sortedData = sortData(allData, Sorter.field, Sorter.order);
    setAllData(sortedData)
    setData(sortedData.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit))
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

  const rowSelection = {
    selectedRowKeys,
    onSelect: (record, checked, rowKeys) => {
      setSelectedRowKeys(rowKeys);
    },
    onSelectAll: (checked, rowKeys) => {
      setSelectedRowKeys(rowKeys);
    },
    getCheckboxProps: record => ({
      disabled: record.node === 'node-4'
    })
  };

  const options = [
    { value: 'AllDeployunits', label: 'All Deploy Units' },
    ...config.deployUnits.map(deployUnit => ({ value: deployUnit, label: deployUnit }))
  ];

  const optionRenderer = (option) => (
    <span className="option-with-icon">
      <Icon name="cluster" style={{ marginRight: 6, verticalAlign: 'middle' }} type="light" />
      <span>{option.label}</span>
    </span>
  );

  const valueRenderer = (option) => (
    <span className="option-with-icon">
      <Icon name="cluster" style={{ marginRight: 6, verticalAlign: 'middle' }} />
      <span>{option.label}</span>
    </span>
  );

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Pagination {...pagination} onChange={handlePageChange} />
      <div>
        <p>Total: {pagination.total}</p>
        <Select
          name="select"
          style={{ width: '60px' }}
          options={PAGINATION_OPTIONS.map(value => ({ value, label: value }))}
          onChange={handleLimitChange}
          defaultValue={5}
        />
      </div>
    </div>
  );

  const getResourceNames = (data, keys) => {
    return data
      .filter(item => keys.includes(item.id)) // Filter rows with matching ids
      .map(item=> ({ Name: item.Name, DeployUnit: item.DeployUnit,ns:item.namespace,currState:item.currState })); // Extract the names
  };

  const batchActions = (
    <>
    <Button
      variant="filled"
      color="warning"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showNetworkModal()
      }}
    >
      Network
    </Button>
    <Button
      variant="filled"
      color="success"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showOpsStateModal()
      }}
    >
      OpsState
    </Button>
    <Button
      variant="filled"
      color="default"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showUpdateModal()
      }}
    >
      Image Update
    </Button>
    <Button
      variant="filled"
      color="success"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showResourceModal()
      }}
    >
      update resources
    </Button>
    <Button
      variant="filled"
      color="warning"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showUPModal()
      }}
    >
      update UP
    </Button>
    <Button
      variant="filled"
      color="error"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showDPModal()
      }}
    >
      update DP
    </Button>
    </>
  );

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <DeleteModal visible={IsDeleteModalVisible} setvisible={setIsDeleteModalVisible} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} gss={false}/>
      <UpdateModal visible={IsUpdateModalVisible} setvisible={setIsUpdateModalVisible} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} />
      <OpsStateModal visible={IsOpsStateModal} setvisible={setIsOpsStateModal} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} />
      <NetworkModal visible={IsNetworkModal} setvisible={setIsNetworkModal} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} />
      <UpdateResourceModal visible={IsResourceModal} setvisible={setIsResourceModal} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} />
      <UPModal visible={IsUPModal} setvisible={setUPModal} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} />
      <DPModal visible={IsDPModal} setvisible={setDPModal} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} />
      <Banner
        className="mb12"
        icon={<Icon name="appcenter" size={40}/>}
        title={t("Project_Gameservers_Table")}
        description={t("Project_Gameservers_description")}
      />
      <ToolbarWrapper>
        {selectedRowKeys.length > 0 && (
          <BatchActions>
            <div className="toolbar-left">{batchActions}</div>
            <div className="toolbar-right">
              <Button
                variant="text"
                className="cancel-select"
                onClick={() => setSelectedRowKeys([])}
              >
                Deselect
              </Button>
            </div>
          </BatchActions>
        )}
        <ToolbarInner style={{ flexGrow: '1' }}>
          <div className="toolbar-left">
            <Select
              style={{ width: '200px' }}
              value={defaultdeploy}
              onChange={handleDeployUnitChange}
              name="select-render"
              optionRenderer={optionRenderer}
              valueRenderer={valueRenderer}
              options={options}
            />
          </div>
          <div className="toolbar-item">
            <FilterInput
              filters={filter}
              suggestions={[
                { label: t('name'), key: 'Name' },
                { label: t('opsState'), key: 'opsState' }
              ]}
              onChange={handleFilterChange}
            />
          </div>
          <div className="toolbar-right">
            <Button variant="text" className="btn-refresh" onClick={refetch}>
              <Refresh />
            </Button>
            <Dropdown content={settingMenu} placement="bottom-end" maxWidth={160}>
              <Button variant="text" className="btn-setting">
                <Cogwheel />
              </Button>
            </Dropdown>
          </div>
        </ToolbarInner>
      </ToolbarWrapper>
      <Table
        rowKey="id"
        columns={columns.filter(col => col.isVisible)}
        dataSource={Data}
        loading={isLoading}
        footer={footer}
        onChange={handleTableChange}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default ProjectGameServerList;
