import * as React from 'react'
import * as typings from './layout.type'
import {observer, inject} from 'mobx-react'
import * as _ from 'lodash'

import {Button, ButtonGroup} from '../../../../../../../../web-common/button/index'
import {Tooltip} from '../../../../../../../../web-common/tooltip/index'
import {Checkbox} from '../../../../../../../../web-common/checkbox/index'
import {Number} from '../../../../../../../../web-common/number/index'

import './layout.scss'

@inject('viewport', 'application') @observer
export default class EditComponentText extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    // 当前编辑的组件
    private componentInfo: FitGaea.ViewportComponentInfo

    componentWillMount() {
        this.componentInfo = this.props.viewport.components.get(this.props.viewport.currentEditComponentMapUniqueKey)
    }

    handleUpdateValue(field: string, value: FitGaea.ComponentPropsOptionValue) {
        this.props.viewport.updateComponentValue(field, value)
    }

    handleChangeReverse(checked: boolean) {
        switch (this.componentInfo.props.style.flexDirection) {
            case 'row':
                this.handleUpdateValue('style.flexDirection', 'row-reverse')
                break
            case 'row-reverse':
                this.handleUpdateValue('style.flexDirection', 'row')
                break
            case 'column':
                this.handleUpdateValue('style.flexDirection', 'column-reverse')
                break
            case 'column-reverse':
                this.handleUpdateValue('style.flexDirection', 'column')
                break
        }
    }

    handleFlexGrowChange(value: string) {
        const intValue = value === '' ? null : parseInt(value)
        if (this.props.application.isReactNative) {
            this.handleUpdateValue('style.flex', intValue)
        } else {
            this.handleUpdateValue('style.flexGrow', intValue)
        }
    }

    /**
     * flex 选项
     */
    renderFlex() {
        // 判断是否逆序
        let isReverse = false
        switch (this.componentInfo.props.style.flexDirection) {
            case 'row':
                isReverse = false
                break
            case 'row-reverse':
                isReverse = true
                break
            case 'column':
                isReverse = false
                break
            case 'column-reverse':
                isReverse = true
                break
        }

        const isRow = this.componentInfo.props.style.flexDirection === 'row' || this.componentInfo.props.style.flexDirection === 'row-reverse'

        // 获取 flex-grow 的输入框格式
        let flexGrowString = ''
        if (this.props.application.isReactNative) {
            flexGrowString = this.componentInfo.props.style.flex ? this.componentInfo.props.style.flex.toString() : ''
        } else {
            flexGrowString = this.componentInfo.props.style.flexGrow ? this.componentInfo.props.style.flexGrow.toString() : ''
        }

        const rowStart = !isReverse ? '左' : '右'
        const columnStart = !isReverse ? '上' : '下'
        const rowEnd = !isReverse ? '右' : '左'
        const columnEnd = !isReverse ? '下' : '上'
        const firstLineDirection = isRow ? '水平' : '竖直'
        const secondLineDirection = isRow ? '竖直' : '水平'

        const rowFlexStart = `${firstLineDirection}方向靠${isRow ? rowStart : columnStart}`
        const rowFlexCenter = `${firstLineDirection}方向居中`
        const rowFlexEnd = `${firstLineDirection}方向靠${isRow ? rowEnd : columnEnd}`
        const rowFlexSpaceBetween = `${firstLineDirection}方向等间距排列`
        const rowFlexSpaceAround = `${firstLineDirection}方向等间距排列, 两侧留一半空间`

        const columnFlexStart = `${secondLineDirection}方向靠${isRow ? '上' : '左'}`
        const columnFlexCenter = `${secondLineDirection}方向居中`
        const columnFlexEnd = `${secondLineDirection}方向靠${isRow ? '下' : '右'}`
        const columnFlexStrech = `${secondLineDirection}方向拉伸`
        const columnFlexBaseline = `${secondLineDirection}方向baseline`

        return (
            <div>
                <div className="layout-top-container"
                     style={{marginTop:5}}>
                    <Tooltip title="Direction:Row">
                        <Button active={this.componentInfo.props.style.flexDirection === 'row' || this.componentInfo.props.style.flexDirection === 'row-reverse'}
                                onClick={this.handleUpdateValue.bind(this, 'style.flexDirection', 'row')}>
                            Row
                        </Button>
                    </Tooltip>

                    <ButtonGroup>
                        <Tooltip title={rowFlexStart}>
                            <Button active={this.componentInfo.props.style.justifyContent === 'flex-start'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'flex-start')}>
                                <svg className="svg-icon rotate-90">
                                    <use xlinkHref="#icon-flex-align"/>
                                </svg>
                            </Button>
                        </Tooltip>
                        <Tooltip title={rowFlexCenter}>
                            <Button active={this.componentInfo.props.style.justifyContent === 'center'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'center')}>
                                <svg className="svg-icon rotate-90">
                                    <use xlinkHref="#icon-flex-center-vertical"/>
                                </svg>
                            </Button>
                        </Tooltip>
                        <Tooltip title={rowFlexEnd}>
                            <Button active={this.componentInfo.props.style.justifyContent === 'flex-end'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'flex-end')}>
                                <svg className="svg-icon rotate-270">
                                    <use xlinkHref="#icon-flex-align"/>
                                </svg>
                            </Button>
                        </Tooltip>
                        <Tooltip title={rowFlexSpaceBetween}>
                            <Button active={this.componentInfo.props.style.justifyContent === 'space-between'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'space-between')}>B</Button>
                        </Tooltip>
                        <Tooltip title={rowFlexSpaceAround}>
                            <Button active={this.componentInfo.props.style.justifyContent === 'space-around'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'space-around')}>A</Button>
                        </Tooltip>
                    </ButtonGroup>
                </div>

                <div className="layout-top-container"
                     style={{marginTop:5}}>
                    <Tooltip title="Direction:Column">
                        <Button active={this.componentInfo.props.style.flexDirection === 'column' || this.componentInfo.props.style.flexDirection === 'column-reverse'}
                                onClick={this.handleUpdateValue.bind(this, 'style.flexDirection', 'column')}>
                            Column
                        </Button>
                    </Tooltip>

                    <ButtonGroup>
                        <Tooltip title={columnFlexStart}>
                            <Button active={this.componentInfo.props.style.alignItems === 'flex-start'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'flex-start')}>S</Button>
                        </Tooltip>
                        <Tooltip title={columnFlexCenter}>
                            <Button active={this.componentInfo.props.style.alignItems === 'center'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'center')}>C</Button>
                        </Tooltip>
                        <Tooltip title={columnFlexEnd}>
                            <Button active={this.componentInfo.props.style.alignItems === 'flex-end'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'flex-end')}>E</Button>
                        </Tooltip>
                        <Tooltip title={columnFlexStrech}>
                            <Button active={this.componentInfo.props.style.alignItems === 'stretch'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'stretch')}>B</Button>
                        </Tooltip>
                        <Tooltip title={columnFlexBaseline}>
                            <Button active={this.componentInfo.props.style.alignItems === 'baseline'}
                                    onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'baseline')}>A</Button>
                        </Tooltip>
                    </ButtonGroup>
                </div>

                <div className="second-container">
                    <Checkbox checked={isReverse}
                              onChange={this.handleChangeReverse.bind(this)}
                              style={{marginTop:5,flexGrow:1,width:0}}>逆序</Checkbox>
                    <div className="second-container-flex-grow-container">
                        <span>Grow</span>
                        <Number label=""
                                onChange={this.handleFlexGrowChange.bind(this)}
                                value={flexGrowString}/>
                    </div>
                </div>
            </div>
        )
    }

    renderDisplay() {
        return (
            <div className="layout-top-container">
                <ButtonGroup>
                    <Tooltip title="Block">
                        <Button active={this.componentInfo.props.style.display === 'block'}
                                onClick={this.handleUpdateValue.bind(this, 'style.display', 'block')}>1</Button>
                    </Tooltip>
                    <Tooltip title="InlineBlock">
                        <Button active={this.componentInfo.props.style.display === 'inline-block'}
                                onClick={this.handleUpdateValue.bind(this, 'style.display', 'inline-block')}>2</Button>
                    </Tooltip>
                    <Tooltip title="Inline">
                        <Button active={this.componentInfo.props.style.display === 'inline'}
                                onClick={this.handleUpdateValue.bind(this, 'style.display', 'inline')}>3</Button>
                    </Tooltip>
                </ButtonGroup>

                <Tooltip title="Flex">
                    <Button active={this.componentInfo.props.style.display === 'flex'}
                            onClick={this.handleUpdateValue.bind(this, 'style.display', 'flex')}>flex</Button>
                </Tooltip>

                <Tooltip title="None">
                    <Button active={this.componentInfo.props.style.display === 'none'}
                            onClick={this.handleUpdateValue.bind(this, 'style.display', 'none')}>
                        <i className="fa fa-eye-slash"/>
                    </Button>
                </Tooltip>
            </div>
        )
    }

    render() {
        return (
            <div className="_namespace">
                {!this.props.application.isReactNative && this.renderDisplay()}

                {(this.componentInfo.props.style.display === 'flex' || this.props.application.isReactNative) && this.renderFlex()}
            </div>
        )
    }
}