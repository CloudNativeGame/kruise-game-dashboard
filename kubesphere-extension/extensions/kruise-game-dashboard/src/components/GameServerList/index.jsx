// Display GameServerSets summary on dashboard

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
    Banner,
    Button,
    Dropdown,
    Field,
    Input,
    Menu,
    MenuItem,
    Modal,
} from '@kubed/components';
import {Avatar, DataTable, Icon, useItemActions,} from "@ks-console/shared";
import {Eye, Pen} from "@kubed/icons";
import axios from "axios";

function GameServerList(props) {
    const authKey = ""; // 当前需要的权限项
    const params = useParams();
    const tableRef = useRef();
    const clusterId = params.name;
    const Gameserverset=params.gameserverset || null;

    const continueStackRef = useRef([""]);
    const [continuetoken, setcontinuetoken] = useState("");

    const gsUrl = '/clusters/' + clusterId + '/kruise-game-dashboard/gameservers';
    const url = '/clusters/' + clusterId + `/apis/game.kruise.io/v1alpha1/gameservers?${Gameserverset &&`labelSelector=game.kruise.io/owner-gss%3D${Gameserverset}`}&continue=${continuetoken}`
    const gssDetailUrl = '/clusters/' + clusterId + '/customresources/gameservers.game.kruise.io/resources';

    const navigate = useNavigate();
    const handleMenuItemClick = () => {
        navigate(gssDetailUrl);
    };

    const [visible, setVisible] = React.useState(false);
    const [fieldValue, setFieldValue] = useState("");
    const [gsName, setGsName] = useState("");
    const [gsNamespace, setGsNamespace] = useState("");
    const [totaldata,settotaldata]=useState(0)
    

    const openModal = (gsName, gsNamespace)  => {
        setVisible(true);
        setGsName(gsName);
        setGsNamespace(gsNamespace)
    };

    const closeModal = () => {
        setVisible(false);
    };

    const handleClick = () => {
        const patchData = {
            spec: {
                opsState: fieldValue
            }
        };

        const response = axios.patch(
            '/clusters/' + clusterId + '/apis/game.kruise.io/v1alpha1/namespaces/'+ gsNamespace + '/gameservers/' + gsName,
            patchData,
            {
                headers: {
                    'Content-Type': 'application/merge-patch+json'
                }
            }
        );

        console.log("Successfully updated the field: ", response.data);
        setVisible(false)
    };

    
    
    useEffect(async ()=>{
        try {
            const response = await axios.get('/clusters/' + clusterId + `/apis/game.kruise.io/v1alpha1/gameservers?${Gameserverset&&`labelSelector=game.kruise.io/owner-gss%3D${Gameserverset}`}`);
            settotaldata(response.items.length)
        } catch (error) {
            console.error('Error fetching game servers:', error);
        }

    },[Gameserverset])
    


    const renderItemActions = useItemActions({
        authKey,
        params: "", // 传递给操作函数的参数
        actions: [
            {
                key: "edit",
                icon: <Icon name="pen"/>,
                text: t("EDIT_INFORMATION"),
                action: "edit", // 权限
                show: true,
                onClick: () => {
                },
            },
            {
                key: "delete",
                icon: <Icon name="trash"/>,
                text: t("DELETE"),
                action: "delete",
                show: true,
                onClick: (_, record) => {
                },
            },
        ],
    });

    function handleFilterInputChange() {
        console.log("input change")
    }

    
    

    function formatServerData(data) {
        const newContinueToken = data.metadata.continue;
        if (newContinueToken && continueStackRef.current[continueStackRef.current.length - 1] !== newContinueToken) {
            continueStackRef.current = [...continueStackRef.current, newContinueToken];
        }
        
        return {
            items: data.items,
            totalItems: totaldata
        }
    }



    // @ts-ignore
    const columns = [
            {
                title: t('name'),
                field: "name", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                    <Field
                        avatar={<Avatar icon={'backup'}/>}
                        label={record.namespace || "-"}
                        value={<Link to={gsUrl}>{record.name}</Link>}
                        />
                    </>
                ),
            },
            {
                title: t('state'),
                field: "state", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        <Field value={value}/>
                    </>
                ),
            },
            {
                title: t('opsState'),
                field: "opsState", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        <Field value={value}/>
                    </>
                ),
            },
            {
                title: t('networkState'),
                field: "networkState", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        <Field value={value}/>
                    </>
                ),
            },
            {
                title: t('images'),
                field: "images", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        {value?.map((item, index) => {
                            return (
                                <Field
                                    key={index}
                                    value={item.key + " -> " + item.value}
                                />
                            )
                        })}
                    </>
                ),
            },
            {
                title: t('conditions'),
                field: "conditions", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        {value?.map((item, index) => {
                            return (
                                <Field
                                    key={index}
                                    value={item.key + ":" + item.value}
                                />
                            )
                        })}
                    </>
                ),
            },
            {
                title: t('DP'),
                field: "DP", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        <Field value={value}/>
                    </>
                ),
            },
            {
                title: t('UP'),
                field: "UP", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        <Field value={value}/>
                    </>
                ),
            },
            {
                title: t('labels'),
                field: "labels", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        {value?.map((item, index) => {
                            return (
                                <Field
                                    key={index}
                                    value={item.key + "=" + item.value}
                                />
                            )
                        })}
                    </>
                ),
            },
            {
                title: t('annotations'),
                field: "annotations", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
                render: (value, record) => (
                    <>
                        {value?.map((item, index) => {
                            return (
                                <Field
                                    key={index}
                                    value={item.key + "=" + item.value}
                                />
                            )
                        })}
                    </>
                ),
            },
            {
                title: t('creationTimestamp'),
                field: "creationTimestamp", // 默认当作筛选参数
                searchable: true, // 搜索
                sortable: true, // 排序
                canHide: true, // 隐藏
            },
            {
                title: t("actions"),
                field: "more",
                canHide: true,
                sortable: false,
                width: 58,
                render: (value, record) => (
                    <>
                        <Dropdown content={
                            <Menu>
                                {/*<MenuLabel>menu label</MenuLabel>*/}
                                <MenuItem icon={<Pen/>} onClick={() => openModal(record.name, record.namespace)}>更新运维状态</MenuItem>

                                <MenuItem icon={<Eye/>} onClick={handleMenuItemClick}>跳转资源页查看详情</MenuItem>
                                {/*<MenuItem icon={<Stop/>}>停止调度</MenuItem>*/}
                                {/*<MenuItem icon={<Pen/>}>Edit</MenuItem>*/}
                                {/*<MenuItem icon={<Trash/>}>Delete</MenuItem>*/}
                            </Menu>
                        }>
                            <Button variant="text" radius="lg">
                                <Avatar icon={<Icon name="more"/>} description={" "}/>
                            </Button>
                        </Dropdown>
                    </>
                )
            }
        ]
    ;

    const format = useCallback(item => {
        let row = {
            id: item.metadata.uid,
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            creationTimestamp: item.metadata.creationTimestamp,
            labels: getItems(item.metadata.labels),
            annotations: getItems(item.metadata.annotations),
            opsState: item.spec.opsState,
            state: item.status.currentState,
            networkState: item.status.networkStatus.currentNetworkState,
            DP: item.status.deletionPriority,
            UP: item.status.updatePriority,
            images: getImages(item.status.podStatus.containerStatuses),
            conditions: getConditions(item.status.conditions),
        };
        return row ;
    }, []);

    function renderBatchActions(){

    }
    

    function getItems(items) {
        const kvs = []
        if (items == undefined) {
            return []
        } else {
            for (let key in items) {
                if (key.includes("kubectl.kubernetes.io/last-applied-configuration") ) {
                    continue
                }
                kvs.push({
                    key: key,
                    value: items[key]
                })
            }
            return kvs
        }
    }
 

    function getImages(items) {
        const kvs = []
        if (items == undefined) {
            return []
        }

        for (let i = 0; i < items.length; i++) {
            kvs.push(
                {
                    key: items[i].name,
                    value: items[i].image,
                }
            )

        }
        return kvs
    }
    function handlePageChange(index,pagelength) {
        setcontinuetoken(continueStackRef.current[index])
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

    return (
        <>
            <Modal
                visible={visible}
                onCancel={closeModal}
                onOk={handleClick}
            >
                <Input placeholder="设置opsState..." value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
            </Modal>

            <Banner
                className="mb12"
                icon={<Icon name="appcenter" size={40}/>}
                title={t("gameservers")}
                description={t("gameservers_description")}
            />
            <DataTable
                ref={tableRef}
                tableName="gameservers"
                rowKey="uid"
                placeholder={t("SEARCH")}
                url={url}
                columns={columns}
                onFilterInputChange={handleFilterInputChange} // 筛选的函数
                // parameters={parameters} // api 带的参数
                onPageChange={handlePageChange} // 分页变动的参数
                serverDataFormat={formatServerData} // 修改接口返回的数据
                format={format} //格式化返回数据
                // batchActions={renderBatchActions} // 批量操作
                // toolbarLeft={} //左侧下拉列表
            />
        </>
    )
}


export default GameServerList;