module Game {
	/**
	 *
	 * @author 
	 *
	 */
	export class Car extends eui.Component{
        public leftWheel: eui.Group;
        public rightWheel: eui.Group;
        public car: eui.Image;
        public allGroup: eui.Group;
		public constructor() {
            super();
            this.skinName = "Game.CarSkin";
		}
		
        protected childrenCreated(): void {
            super.childrenCreated();
            this.allGroup.y = -150;
        }
		
		public changeWay(leftFlag:Boolean){
		    if(leftFlag){
                this.allGroup.x = 0;
		    }else{
                this.allGroup.x = -70;
		    }
		}
	}
}
