var Game;
(function (Game) {
    /**
     *
     * @author
     *
     */
    var Success = (function (_super) {
        __extends(Success, _super);
        function Success() {
            _super.call(this);
            this.skinName = "Game.SuccessSkin";
        }
        var d = __define,c=Success,p=c.prototype;
        p.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.Confirm.name = "success";
            this.TimeLabel.text = "0";
            this.Collision.text = "0";
            //this.Confirm.addEventListener(egret.TouchEvent.TOUCH_TAP,this.confirmFunction,this);
        };
        p.setTimeLabel = function (second) {
            this.TimeLabel.text = second + "";
        };
        p.setCollision = function (collision) {
            this.Collision.text = collision + "";
        };
        p.setLabelText = function (text) {
            this.labelText.text = text + "";
        };
        p.confirmFunction = function () {
            this.parent.removeChild(this);
        };
        return Success;
    }(eui.Component));
    Game.Success = Success;
    egret.registerClass(Success,'Game.Success');
})(Game || (Game = {}));
//# sourceMappingURL=Success.js.map