import Application from '../../../store/application';
import Setting from '../../../store/setting';
import Viewport from '../../../store/viewport';
export interface PropsDefine {
    setting?: Setting;
    application?: Application;
    viewport?: Viewport;
}
export declare class Props implements PropsDefine {
}
export interface StateDefine {
    show?: boolean;
}
export declare class State implements StateDefine {
    show: boolean;
}
