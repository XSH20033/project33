import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('effect')
export class effect extends Component {
    start() {
        let effectAni = this.node.getComponent(Animation);
        effectAni.play();
        effectAni.on(Animation.EventType.FINISHED, this.onFinishAni, this)
    }

    onFinishAni(){
        this.node.destroy();
    }
}


