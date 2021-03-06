/**
 * 整体应用的信息,一个 app 通用的配置信息
 */

import {observable, action, transaction} from 'mobx'
import * as React from 'react'
import * as _ from 'lodash'
import deepDiff from '../utils/deep-diff'
import Event from './event'
import * as LZString from 'lz-string'
import {PropsDefine as GaeaPropsDefine} from '../gaea-editor.type'

export default class Application {
    public event = new Event()

    /**
     * 头部栏高度
     */
    @observable headerHeight = 37

    /**
     * 左侧边栏宽度
     */
    @observable leftSidebarWidth = 240

    /**
     * 右侧边栏宽度
     */
    @observable sidebarWidth = 240

    /**
     * 右附加侧边栏宽度
     */
    @observable sidebarAddonWidth = 280

    /**
     * 底部栏高度
     */
    @observable footerHeight = 25

    /**
     * 是否正在移动侧边栏
     */
    @observable isSidebarMoving = false

    /**
     * 是否在预览状态
     */
    @observable isPreview = false

    /**
     * 组合组件
     */
    @observable comboComponents: Array<FitGaea.ComboComponentInfo> = []

    /**
     * 当前版本列表页数
     */
    currentVersionPage = 0

    /**
     * 当前版本列表数组
     */
    @observable versionList: Array<FitGaea.GetPublishListResult> = []

    /**
     * 当前版本号
     */
    @observable currentVersion: string

    /**
     * 基础组件
     */
    baseComponents: Array<React.ComponentClass<FitGaea.ComponentProps>> = []

    /**
     * 定制组件
     */
    customComponents: Array<React.ComponentClass<FitGaea.ComponentProps>> = []

    /**
     * 是否隐藏通用组件
     */
    isHideCustomComponents = false

    /**
     * 标题名称
     */
    title = ''

    /**
     * 页面高度
     */
    height: number

    /**
     * 是不是 reactNative
     */
    isReactNative: boolean

    /**
     * 是否是浏览模式,不能保存
     */
    explore: boolean

    @action('初始化配置') setInitPropsToApplication(props: GaeaPropsDefine) {
        this.title = props.title
        this.baseComponents = props.baseComponents
        this.setCustomComponents(props.customComponents)
        this.isHideCustomComponents = props.isHideCustomComponents
        this.height = props.height
        this.isReactNative = props.isReactNative
        this.currentVersion = props.currentVersion
        this.explore = props.explore
    }

    @action('设置定制组件') setCustomComponents(customComponents: Array<React.ComponentClass<FitGaea.ComponentProps>>) {
        this.customComponents = customComponents
    }

    @action('添加一个组合') addComboComponent(comboComponent: FitGaea.ComboComponentInfo) {
        // 添加之前，把能删的都删掉
        comboComponent.componentInfo = this.cleanComponent(comboComponent.componentInfo)
        comboComponent.childs && Object.keys(comboComponent.childs).forEach(childMapUniqueKey=> {
            comboComponent.childs[childMapUniqueKey] = this.cleanComponent(comboComponent.childs[childMapUniqueKey])
        })

        this.comboComponents.push(comboComponent)
    }

    @action('根据 uniqueKey 获取组件 Class') getComponentByUniqueKey(uniqueKey: string) {
        if (this.baseComponents) {
            for (let component of this.baseComponents) {
                if (component.defaultProps.gaeaUniqueKey === uniqueKey) {
                    return component
                }
            }
        }

        for (let component of this.customComponents) {
            if (component.defaultProps.gaeaUniqueKey === uniqueKey) {
                return component
            }
        }

        return null
    }

    @action('设置侧边栏宽度') setSidebarWidth(value: number) {
        if (value < 180) {
            value = 180
        }
        if (value > 600) {
            value = 600
        }
        this.sidebarWidth = value
    }

    @action('设置侧边栏是否在移动状态') setSidebarMoving(isMoving: boolean) {
        this.isSidebarMoving = isMoving
    }

    @action('修改预览状态') setPreview(isPreview: boolean) {
        this.isPreview = isPreview
    }

    @action('设置当前版本列表业务') setCurrentVersionPage(page: number) {
        this.currentVersionPage = page
    }

    @action('添加版本') addVersions(versions: Array<FitGaea.GetPublishListResult>) {
        transaction(()=> {
            versions && versions.forEach(version=> {
                this.versionList.push(version)
            })
        })
    }

    @action('设置当前最新版本号') setCurrentVersion(version: string) {
        this.currentVersion = version
    }

    @action('增加刚刚发布的版本到版本列表中') publishToVersionList(versionInfo: FitGaea.GetPublishListResult) {
        // 如果还没有获取过版本信息，不需要添加，添加再获取最新的内容就重复了
        if (this.versionList.length > 0) {
            this.versionList.unshift(versionInfo)
        }
    }

    /************************************************************
     * 辅助方法
     ************************************************************/

    /**
     * 将 componentInfo 不需要保存的信息都移除
     */
    cleanComponent(componentInfo: FitGaea.ViewportComponentInfo) {
        // 转成标准格式
        const planComponentInfo: FitGaea.ViewportComponentInfo = JSON.parse(JSON.stringify(componentInfo))

        // layoutChilds 长度为 0 就干掉
        if (planComponentInfo.layoutChilds && planComponentInfo.layoutChilds.length === 0) {
            delete planComponentInfo.layoutChilds
        }

        planComponentInfo.props = this.cleanComponentProps(planComponentInfo.props)

        if (planComponentInfo.props === null) {
            delete planComponentInfo.props
        }

        return JSON.parse(JSON.stringify(planComponentInfo))
    }

    /**
     * 将 props 中不需要的数据都清除
     */
    cleanComponentProps(componentProps: FitGaea.ComponentProps) {
        // 获取这个组件的 defaultProps
        const defaultProps = _.cloneDeep(this.getComponentByUniqueKey(componentProps.gaeaUniqueKey).defaultProps)
        let planComponentProps = JSON.parse(JSON.stringify(componentProps))

        // 把 defaultProps 中相同的内容从 props 中剥离掉
        const deepDiffProps = deepDiff(planComponentProps, defaultProps)

        // 一定要留着 gaeaUniqueKey
        deepDiffProps.gaeaUniqueKey = planComponentProps.gaeaUniqueKey

        planComponentProps = deepDiffProps

        delete planComponentProps.gaeaEdit
        delete planComponentProps.gaeaIcon
        delete planComponentProps.gaeaEvent

        if (planComponentProps.gaeaEventData.length === 0) {
            delete planComponentProps.gaeaEventData
        }

        if (planComponentProps.gaeaNativeEventData.length === 0) {
            delete planComponentProps.gaeaNativeEventData
        }

        if (planComponentProps.gaeaVariables.length === 0) {
            delete planComponentProps.gaeaVariables
        }

        if (_.isEmpty(planComponentProps.style)) {
            delete planComponentProps.style
        }

        // 如果 props 已经被删完了, 直接删掉 props
        if (!planComponentProps || Object.keys(planComponentProps).length === 0) {
            return null
        }

        return planComponentProps
    }

    /**
     * 把组件完整信息补回来，根据 defaultProps
     */
    expendComponent(componentInfo: FitGaea.ViewportComponentInfo) {
        // 转成标准格式
        const planComponentInfo = _.toPlainObject<FitGaea.ViewportComponentInfo>(componentInfo)

        planComponentInfo.props = this.expendComponentProps(planComponentInfo.props)

        return planComponentInfo
    }

    /**
     * 补全组件 props
     */
    expendComponentProps(componentProps: FitGaea.ComponentProps){
        // 转成标准格式
        let planComponentProps = _.toPlainObject<FitGaea.ComponentProps>(componentProps)

        // 获取这个组件的 defaultProps
        const defaultProps = _.cloneDeep(this.getComponentByUniqueKey(planComponentProps.gaeaUniqueKey).defaultProps)

        planComponentProps = _.merge(defaultProps, planComponentProps)

        return planComponentProps
    }
}