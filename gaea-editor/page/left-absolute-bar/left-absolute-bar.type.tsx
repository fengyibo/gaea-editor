import * as React from 'react'
import Application from '../../store/application'
import Viewport from '../../store/viewport'

export interface PropsDefine {
    application?: Application
    viewport?: Viewport
}

export class Props implements PropsDefine {

}

export interface StateDefine {
    currentName?: string
}

export class State implements StateDefine {
    currentName = null as string
}