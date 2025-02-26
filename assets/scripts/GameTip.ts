import { _decorator, find, Prefab, instantiate, Animation } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;
// 

@ccclass('GameTip')
export class GameTip extends GameBase {
    @property(Prefab)
    gameTipPre: Prefab = null;

    start() {
        //
        this.eventCenter.AddListener("OnCreateTip", this.onCreateTip, this);
    }

    onDestroy(){
        //
        this.eventCenter.RemoveListener("OnCreateTip", this.onCreateTip, this);
    }

    onCreateTip(index){
        let tip = instantiate(this.gameTipPre);
        this.node.addChild(tip);
        //
        this.updateTipView(tip, index);
    }

    updateTipView(tip, index){
        for(let i = 0; i < tip.children.length; i++){
            let curTip = tip.getChildByName("tip" + i);
            curTip.active = false;
            if(index == i){
                curTip.active = true;
            }
        }
    }
}


