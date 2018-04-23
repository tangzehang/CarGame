module Game {
	/**
	 *
	 * @author 
	 *
	 */
	export class Road extends eui.Component{
    	
    	public background:eui.Image;
    	
		public constructor() {
            super();
            this.skinName = "Game.RoadSkin";
		}
		
		public changeBackGround(type){
		    this.background.source = "background" + type;
		}
	}
}
