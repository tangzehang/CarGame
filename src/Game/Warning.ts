module Game {
	/**
	 *
	 * @author 
	 *
	 */
	export class Warning extends eui.Component{
        public Confirm: eui.Image;
		public constructor() {
            super();
            this.skinName = "Game.WarningSkin";
		}
		
        protected childrenCreated(): void {
            super.childrenCreated();
            this.Confirm.name = "warning";
            //this.Confirm.addEventListener(egret.TouchEvent.TOUCH_TAP,this.confirmFunction,this);
        }
        
        private confirmFunction(){
            this.parent.removeChild(this);
        }
	}
}
