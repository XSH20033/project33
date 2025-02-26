import { _decorator, find, Node, Prefab, instantiate, Label, sys} from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameLevel')
export class GameLevel extends GameBase {
    /***/
    @property(Prefab)
    fightPanel: Prefab = null;
    /***/
    @property(Prefab)
    mainPanel: Prefab = null;

    contentNode: Node = null;

    start () {
        this.contentNode = this.node.getChildByName("level_view");
        this.updateGameLevel();
    }

    updateGameLevel(){
        let level = this.manager.getGameLevel();
        for(let i = 0; i < 5; i++){
            let maskNode = this.contentNode.getChildByName("level" + Number(i)).getChildByName("lock");
            if(maskNode){
                maskNode.active = true;
                if(i <= level){
                    // 
                    maskNode.active = false;
                }
            }
        }
    }

    onBackBtn() {
        // 
        this.node.destroy();
        // 
        this.soundMrg.playEffect("click");
        // 
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.mainPanel));
        // 
        this.manager.setGameState(GameState.GAME_MAIN);
    }

    onPlayBtn(event, data) {
        let playIndex = Number(data);
        if(playIndex > this.manager.getGameLevel()){
            return;
        }
        this.node.destroy();
        // 
        let mainNode = find("Canvas/panel/main");
        if(mainNode){
            mainNode.destroy();
        }
        // 
        this.soundMrg.playEffect("click");
        this.soundMrg.playMusic("fight", true);
        //
        this.manager.ResetGameData();
        // 
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.fightPanel));
        // 
        console.log("" + playIndex);
        this.manager.setFightType(playIndex);
        this.eventCenter.dispatchEvent("UpdateGameData",null);
        // 
        this.manager.setGameState(GameState.GAME_FIGHT);
    }
}


