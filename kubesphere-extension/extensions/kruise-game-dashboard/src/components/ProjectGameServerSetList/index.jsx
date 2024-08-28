import React, { useEffect, useState } from 'react';
import { Button, FilterInput, Menu, MenuItem, MenuLabel, Dropdown, Field,Banner, notify } from '@kubed/components';
import { Refresh, Cogwheel, Eye, EyeClosed, Trash, Pen } from "@kubed/icons";
import { Table, Pagination, Select } from "@kube-design/components";
import {  useParams } from 'react-router-dom';
import { Avatar, Icon, } from "@ks-console/shared";
import axios from 'axios';
import { ToolbarWrapper, ToolbarInner, BatchActions } from './style.jsx';
import { DeleteModal } from '../../GSS_Modals/DeleteModal.jsx';
import { UpdateModal } from '../../GSS_Modals/UpdateModal.jsx';
import { UpdateReplicaModal } from '../../GSS_Modals/UpdateReplicaModal.jsx';
import { EditModal } from '../../GSS_Modals/EditModal.jsx';

const PAGINATION_OPTIONS = [5, 10, 50];

const ProjectGameServerSetList = () => {

  const COLUMNS = [
    { title: t('name'), dataIndex: 'Name',  canHide: true, isVisible: true,render: (value, record) => (  <Field    label={record.namespace || "-"}  value={record.Name}  />), },
    { title: t('deployUnit'), dataIndex: 'DeployUnit', searchable: true, canHide: true, isVisible: true },
    { title: t('replicas'), dataIndex: 'replicas',  canHide: true, isVisible: true },
    { title: t('gsStatus'), dataIndex: 'gsStatus',  canHide: true, isVisible: true, render: (value, record) => (<>  <Field value={value[6] + "/" + value[0]}/>  </>),},
    { title: t('maintainingReplicas'), dataIndex: 'maintainingReplicas', isVisible: true,canHide: true },
    { title: t('waitToBeDeletedReplicas'), dataIndex: 'waitToBeDeletedReplicas', isVisible: true ,canHide: true},
    { title: t('templateImages'), dataIndex: 'templateImages', isVisible: false,canHide: true, render: (value, record) => (<>{value?.map((item, index) => {return (<Field key={index} value={item[0] + " -> " + item[1]}/>)})}</>), },
    { title: t('templateResources'), dataIndex: 'templateResources', isVisible: false,canHide: true,render: (value, record) => (<>{value?.map((item, index) => {return (<Field  key={index}  value={item.key + " -> " + item.value}  />  )  })}  </>), },
    { title: t('labels'), dataIndex: 'labels', isVisible: false,canHide: true,render: (value, record) => (<>  {value?.map((item, index) => {  return (  <Field    key={index}  value={item.key + "=" + item.value}  />  )  })}  </>), },
    { title: t('annotations'), dataIndex: 'annotations', isVisible: false,canHide: true },
    { title: t('creationTimestamp'), dataIndex: 'creationTimestamp', isVisible: false,canHide: true },
    { title: t('actions'), dataIndex: 'more', isVisible: true, width: 58, render: (value, record) => (
      <>
          <Dropdown content={
              <Menu>
                  <MenuItem icon={<Pen/>} onClick={()=>{setresources([{Name:record.Name,DeployUnit:record.DeployUnit,ns:record.namespace,currState:record.currState}]),showReplicaModal()}}>Update replicas</MenuItem>
                  <MenuItem icon={<Pen/>} onClick={()=>{setresources([{Name:record.Name,DeployUnit:record.DeployUnit,ns:record.namespace,currState:record.currState}]),showUpdateModal()}}>Update image</MenuItem>
                  <MenuItem icon={<Trash/>} onClick={()=>{setresources([{Name:record.Name,DeployUnit:record.DeployUnit,ns:record.namespace,currState:record.currState}]),showDeleteModal()}}>Delete</MenuItem>
                  <MenuItem icon={<Pen/>} onClick={()=>{setresources([{Name:record.Name,DeployUnit:record.DeployUnit,ns:record.namespace,currState:record.currState}]),showEditModal()}}>Edit YAML</MenuItem>
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
  const [IsRelicaModalVisible, setIsRelicaModalVisible] = useState(false);
  const [IsEditModalVisible, setIsEditModalVisible] = useState(false);
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
    const fetchGameServerSets = async () => {
      const fetchClusterData = async (clusterId) => {
        try {
          const filterParams = new URLSearchParams({
            labelSelector: `${config.projectLabel}=${projectId}`
          }).toString();
          const response = await axios.get(`/clusters/${clusterId}/apis/game.kruise.io/v1alpha1/gameserversets?${filterParams}`);
          return (response.items !== undefined ? response.items : response.data.items);
        } catch (error) {
          notify.error(`Error fetching data for cluster ${clusterId}:`, error);
          return [];
        }
      };

      try {
        setIsLoading(true);
        const results = await Promise.all(deployUnits.map(fetchClusterData));
        const ProjectGameServerList = []
        results.forEach((gameServerSets, index) => {
          const clusterId = deployUnits[index];
          gameServerSets.forEach(item => {
            let row = {
              id: item.metadata.uid,
              Name: item.metadata.name,
              namespace: item.metadata.namespace,
              creationTimestamp: item.metadata.creationTimestamp,
              replicas: item.spec.replicas,
              readyReplicas: item.status.readyReplicas,
              currentReplicas: item.status.currentReplicas,
              maintainingReplicas: item.status.maintainingReplicas,
              waitToBeDeletedReplicas: item.status.waitToBeDeletedReplicas,
              labels: Object.values(getItems(item.metadata.labels)),
              annotations: Object.values(getItems(item.metadata.annotations)),
              containers: item.spec.gameServerTemplate.containers,
              gsStatus: Object.values(item.status),
              templateImages: (getImages(item.spec.gameServerTemplate.spec.containers)),
              templateResources: Object.values(getResources(item.spec.gameServerTemplate.spec.containers)),
              DeployUnit: clusterId,
              currState: item,
            };
            ProjectGameServerList.push(row)
          })

        })
        if (isMounted) {
          setAllData(ProjectGameServerList);
          setData(ProjectGameServerList.slice(0, pagination.limit))
          setPagination(prevState => ({...prevState,total: ProjectGameServerList.length}));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (config.deployUnits.length > 0) {
      fetchGameServerSets();
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
      return filters.every(filter => item[filter.id] === filter.value);
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

  const showReplicaModal = () => {
    setIsRelicaModalVisible(true);
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsUpdateModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsRelicaModalVisible(false);
    setIsEditModalVisible(false);
  }

  const handleOk = (value) => {
    handleCancel()
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
      color="error"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showDeleteModal()
      }}
    >
      Delete
    </Button>
    <Button
      variant="primary"
      color="error"
      onClick={() => {
        setresources(getResourceNames(allData, selectedRowKeys));
        showUpdateModal()
      }}
    >
      Update Image
    </Button>
    </>
  );

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <DeleteModal visible={IsDeleteModalVisible} setvisible={setIsDeleteModalVisible} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources} gss={true}/>
      <UpdateModal visible={IsUpdateModalVisible} setvisible={setIsUpdateModalVisible} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources}/>
      <UpdateReplicaModal visible={IsRelicaModalVisible} setvisible={setIsRelicaModalVisible} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources}/>
      <EditModal visible={IsEditModalVisible} setvisible={setIsEditModalVisible} loading={setIsLoading} onCancel={handleCancel} onOk={handleOk} resources={resources}/>
      <Banner
        className="mb12"
        icon={<Icon name="appcenter" size={40}/>}
        title={t("Project_Gameserversets_Table")}
        description={t("Project_Gameserversets_description")}
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
                { label: t('name'), key: 'Name' }
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

export default ProjectGameServerSetList;
