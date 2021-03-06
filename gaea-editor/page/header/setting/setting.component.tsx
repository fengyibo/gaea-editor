import * as React from 'react'
import * as typings from './setting.type'
import {observer, inject} from 'mobx-react'

import Modal from '../../../../../../web-common/modal/index'
import Switch from '../../../../../../web-common/switch/index'
import {Radio, RadioGroup} from '../../../../../../web-common/radio/index'
import Color from './utils/color/color.component'
import {autoBindMethod} from '../../../../../../common/auto-bind/index'

import './setting.scss'

@inject('setting', 'application', 'viewport') @observer
export default class Setting extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    @autoBindMethod handleShowModal() {
        this.setState({
            show: true
        })
    }

    @autoBindMethod handleOk() {
        this.setState({
            show: false
        })
    }

    @autoBindMethod handleCancel() {
        this.setState({
            show: false
        })
    }

    @autoBindMethod setConfirmWhenRemoveComponent(checked: boolean) {
        this.props.setting.setConfirmWhenRemoveComponent(checked)
    }

    @autoBindMethod setShowLayout(checked: boolean) {
        this.props.setting.setShowLayout(checked)
    }

    @autoBindMethod handleBackgroundColorChange(color: any) {
        this.props.setting.setBackgroundColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, color.rgb.a)
    }

    @autoBindMethod handleBackgroundColorChangeComplete(color: any) {

    }

    render() {
        return (
            <div className="menu-item"
                 onClick={this.handleShowModal}>
                设置
                <div className="_namespace">
                    <Modal className="_namespace"
                           title="设置"
                           show={this.state.show}
                           onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}>

                        <div className="left-right">
                            <div className="left">点击移除时会弹出确认框</div>
                            <div className="right">
                                <Switch checked={this.props.setting.data.confirmWhenRemoveComponent}
                                        onChange={this.setConfirmWhenRemoveComponent}/>
                            </div>
                        </div>

                        <div className="left-right">
                            <div className="left">拖动时显示所有布局元素</div>
                            <div className="right">
                                <Switch checked={this.props.setting.data.showLayout}
                                        onChange={this.setShowLayout}/>
                            </div>
                        </div>

                        <div className="left-right">
                            <div className="left">画布背景颜色</div>
                            <div className="right">
                                <Color color={this.props.setting.data.backgroundColor}
                                       absoluteStyle={{left:-200,zIndex:1070}}
                                       viewport={this.props.viewport}
                                       application={this.props.application}
                                       onChange={this.handleBackgroundColorChange}
                                       onChangeComplete={this.handleBackgroundColorChangeComplete}/>
                            </div>
                        </div>

                    </Modal>
                </div>
            </div>
        )
    }
}