import { _decorator, find, Node, instantiate, Prefab } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameHelp')
export class GameHelp extends GameBase {

    helpIndex: number = 0;

    start() {
        this.updateHelpView();
    }

    updateHelpView(){
        for(let i = 0; i < 2; i++){
            let cur_help = this.node.getChildByName("help" + i);
            cur_help.active = false;
            if(this.helpIndex == i){
                cur_help.active = true;
            }
        }
    }

    onCloseBtn(){
        this.node.active = false;
        // 
        this.soundMrg.playEffect("click");
        // 
        this.manager.setGameState(GameState.GAME_FIGHT);
    }

    onLeftBtn(){
        // 
        this.soundMrg.playEffect("click");
        //
        this.helpIndex--;
        if(this.helpIndex < 0){
            this.helpIndex = 1;
        }
        //
        this.updateHelpView();
    }

    onRightBtn(){
        // 
        this.soundMrg.playEffect("click");
        //
        this.helpIndex++;
        if(this.helpIndex > 1){
            this.helpIndex = 0;
        }
        //
        this.updateHelpView();
    }
}


