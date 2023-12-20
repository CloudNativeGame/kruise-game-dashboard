// Display GameServerSets summary on dashboard

import React, {useCallback, useRef} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Banner, Button, Dropdown, Field, Menu, MenuItem, MenuLabel} from '@kubed/components';
import {Avatar, DataTable, Icon,} from "@ks-console/shared";
import * as PropTypes from "prop-types";
import {Eye} from "@kubed/icons";

function Tooltip(props) {
    return null;
}

Tooltip.propTypes = {
    content: PropTypes.string,
    children: PropTypes.node
};

function GameServerSetList(props) {
    const module = "kruise-game-dashboard"; //当前模块
    const authKey = module; // 当前需要的权限项
    const params = useParams();
    const tableRef = useRef();
    const clusterId = params.name;
    const gsUrl = '/clusters/' + clusterId + '/kruise-game-dashboard/gameservers';
    const url = '/clusters/' + clusterId + '/apis/game.kruise.io/v1alpha1/gameserversets'
    const gssDetailUrl = '/clusters/' + clusterId + '/customresources/gameserversets.game.kruise.io/resources';

    const navigate = useNavigate();
    const handleMenuItemClick = () => {
        navigate(gssDetailUrl);
    };

    function handleFilterInputChange() {
        console.log("input change")
    }

    function formatServerData(data) {
        return {
            items: data.items,
            totalItems: data.items.length
        }
    }

    function handlePageChange() {
    }


    const columns = [
        {
            title: t('name'),
            field: "name", // 默认当作筛选参数
            searchable: true, // 搜索
            sortable: true, // 排序
            canHide: true, // 隐藏
            render: (value, record) => (
                <Field
                    avatar={<Avatar icon={'backup'}/>}
                    label={record.namespace || "-"}
                    value={<Link to={gsUrl}>{record.name}</Link>}
                />
            ),
        },

        {
            title: t('replicas'),
            field: "replicas", // 默认当作筛选参数
        },
        {
            title: t('gsStatus'),
            field: "gsStatus", // 默认当作筛选参数
            searchable: true, // 搜索
            sortable: true, // 排序
            canHide: true, // 隐藏
            render: (value, record) => (
                <>
                    <Field value={value.replicas + "/" + value.availableReplicas}/>
                </>
            ),
        },
        {
            title: t('maintainingReplicas'),
            field: "maintainingReplicas", // 默认当作筛选参数
        },
        {
            title: t('waitToBeDeletedReplicas'),
            field: "waitToBeDeletedReplicas", // 默认当作筛选参数
        },
        {
            title: t('templateImages'),
            field: "templateImages", // 默认当作筛选参数
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
            title: t('templateResources'),
            field: "templateResources", // 默认当作筛选参数
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

                            <MenuItem icon={<Eye/>} onClick={handleMenuItemClick}>
                                跳转资源页查看详情
                            </MenuItem>

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

    const format = useCallback(item => {
        let row = {
            id: item.metadata.uid,
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            creationTimestamp: item.metadata.creationTimestamp,
            replicas: item.spec.replicas,
            readyReplicas: item.status.readyReplicas,
            currentReplicas: item.status.currentReplicas,
            maintainingReplicas: item.status.maintainingReplicas,
            waitToBeDeletedReplicas: item.status.waitToBeDeletedReplicas,
            labels: getItems(item.metadata.labels),
            annotations: getItems(item.metadata.annotations),
            containers: item.spec.gameServerTemplate.containers,
            gsStatus: item.status,
            templateImages: getImages(item.spec.gameServerTemplate.spec.containers),
            templateResources: getResources(item.spec.gameServerTemplate.spec.containers),
        };
        return row;
    }, []);


    function getItems(items) {
        const kvs = []
        if (items == undefined) {
            return []
        } else {
            for (let key in items) {
                if (key.includes("kubectl.kubernetes.io/last-applied-configuration")) {
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

    function getResources(items) {
        const kvs = []
        if (items == undefined) {
            return []
        }

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

    return (
        <>
            <Banner
                className="mb12"
                icon={<Icon name="appcenter" size={40}/>}
                title={t("gameserversets")}
                description={t("gameserversets_description")}
            />
            <DataTable
                ref={tableRef}
                tableName="gameserversets"
                rowKey="uid"
                placeholder={t("SEARCH")}
                url={url}
                columns={columns}
                onFilterInputChange={handleFilterInputChange} // 筛选的函数
                // parameters={parameters} // api 带的参数
                onPageChange={handlePageChange} // 分页变动的参数
                serverDataFormat={formatServerData} // 修改接口返回的数据
                format={format} //格式化返回数据
                // batchActions={renderBatchActions()} // 批量操作
                // toolbarLeft={} //左侧下拉列表
            />
        </>
    )
}


export default GameServerSetList;