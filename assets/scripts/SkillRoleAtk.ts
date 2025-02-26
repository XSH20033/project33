import { _decorator, Enum, Node, Vec3, v3, view, Animation } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('SkillRoleAtk')
export class SkillRoleAtk extends GameBase {
    //
    move_peed: number = 5;

    start() {

    }

    update(deltaTime: number) {
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }
        //
        let pos = this.node.position;
        let moveX = pos.x + this.move_peed;
        let moveY = pos.y;
        this.node.position = v3(moveX,moveY);
    }
}


