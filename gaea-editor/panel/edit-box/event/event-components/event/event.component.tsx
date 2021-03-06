import * as React from 'react'
import * as typings from './event.type'
import {observer, inject} from 'mobx-react'

import AutoComplete from '../../../../../../../../web-common/auto-complete/index'

import './event.scss'

@inject('viewport') @observer
export default class Event extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    // 当前编辑的组件
    private componentInfo: FitGaea.ViewportComponentInfo

    handleChange(value: string) {
        this.props.viewport.prepareWriteHistory()
        const eventData = this.props.isWeb ? 'gaeaEventData' : 'gaeaNativeEventData'
        this.props.viewport.updateEventData(this.props.viewport.currentEditComponentMapUniqueKey, `${eventData}.${this.props.index}.eventData.emit`, value)
        this.props.viewport.writeHistory()
    }

    render() {
        this.componentInfo = this.props.viewport.components.get(this.props.viewport.currentEditComponentMapUniqueKey)

        const customData = this.props.isWeb ? this.componentInfo.props.gaeaEventData[this.props.index].eventData as FitGaea.EventActionEvent : this.componentInfo.props.gaeaNativeEventData[this.props.index].eventData as FitGaea.EventActionEvent

        return (
            <AutoComplete value={customData.emit||''}
                          label="触发的事件名称"
                          onChange={this.handleChange.bind(this)}
                          onSelect={this.handleChange.bind(this)}/>
        )
    }
}