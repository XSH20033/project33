import { _decorator, Enum, Node, Vec3, v3, view, Animation } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('SkillShield')
export class SkillShield extends GameBase {
    //
    life_Time: number = 5;
    bDeath: boolean = false;

    start() {

    }

    update(deltaTime: number) {
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }

        if(this.bDeath){
            return;
        }
        this.life_Time -= deltaTime;
        if(this.life_Time <= 0){
            this.bDeath = true;
            this.node.destroy();
        }
    }

    setLifeTime(time){
        this.life_Time = time;
    }
}


