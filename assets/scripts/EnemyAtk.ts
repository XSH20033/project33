import { _decorator, Enum, Node, Vec3, v3, view, Animation } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;
// 
const atkEnum = Enum({
    atk0: 0,//
    atk1: 1,//
    atk2: 2,//
});

@ccclass('EnemyAtk')
export class EnemyAtk extends GameBase {
    /***/
    @property({ type: Enum(atkEnum), displayName: '' })
    atkIndex = atkEnum.atk0;
    //
    move_peed: number = -5;
    min_pos_x: number = -200;
    atk: number = 0;
    atk_arr: number[] = [1, 2, 3];

    start() {
        this.atk = this.atk_arr[this.atkIndex];
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

        if(moveX < this.min_pos_x){
            this.node.destroy();
        }
    }

    getEnemyAtk(){
        return this.atk;
    }
}


