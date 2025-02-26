import { _decorator, Label, Node, Prefab, find, instantiate, sys, EditBox } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameStart')
export class GameStart extends GameBase {
    @property(Prefab)
    mainPanel: Prefab = null;

    start () {
    }

    onStartBtn() {
        this.node.active = false;
        this.soundMrg.playEffect("click");
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.mainPanel));
        this.manager.setGameState(GameState.GAME_MAIN);
    }

    onResetBtn(){
        this.soundMrg.playEffect("click");
        sys.localStorage.clear();
    }
}


