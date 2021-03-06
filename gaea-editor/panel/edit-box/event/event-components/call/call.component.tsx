import * as React from 'react'
import * as typings from './call.type'
import {observer, inject} from 'mobx-react'

import Input from '../../../../../../../../web-common/input/index'

import './call.scss'

@inject('viewport') @observer
export default class Call extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    // 当前编辑的组件
    private componentInfo: FitGaea.ViewportComponentInfo

    handleChange(value: string) {
        this.props.viewport.prepareWriteHistory()
        const eventData = this.props.isWeb ? 'gaeaEventData' : 'gaeaNativeEventData'
        this.props.viewport.updateEventData(this.props.viewport.currentEditComponentMapUniqueKey, `${eventData}.${this.props.index}.eventData.url`, value)
        this.props.viewport.writeHistory()
    }

    render() {
        this.componentInfo = this.props.viewport.components.get(this.props.viewport.currentEditComponentMapUniqueKey)

        const customData = this.props.isWeb ? this.componentInfo.props.gaeaEventData[this.props.index].eventData as FitGaea.EventActionCall : this.componentInfo.props.gaeaNativeEventData[this.props.index].eventData as FitGaea.EventActionCall

        return (
            <div></div>
        )
    }
}