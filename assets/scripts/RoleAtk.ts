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

@ccclass('RoleAtk')
export class RoleAtk extends GameBase {
     /***/
     @property({ type: Enum(atkEnum), displayName: '' })
     atkIndex = atkEnum.atk0;
     //
     move_peed: number = 5;
     max_pos_x: number = 200;
     atk: number = 0;
     atkValue: number[] = [1, 2, 3];
     addAtk: number = 1;
 
     start() {
        let roleLvData = this.manager.getRoleLvData();
        let roleLv = roleLvData[this.atkIndex];
        this.atk = this.atkValue[this.atkIndex] + roleLv * this.addAtk;
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
 
         if(moveX > this.max_pos_x){
             this.node.destroy();
         }
     }

     getRoleAtk(){
        return this.atk;
     }
}


