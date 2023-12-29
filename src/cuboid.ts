import { Button, Color, GameObject, HorizontalBox, Player, PlayerPermission, Rotator, Text, UIElement, Vector, refObject } from "@tabletop-playground/api";

const WHITE = new Color(1, 1, 1, 1);

((obj: GameObject) => {
    const doTakeOwnership = (p: Player): boolean => {
        obj.setOwningPlayerSlot(p.getSlot());
        obj.setPrimaryColor(p.getPlayerColor());
        return true;
    };

    const doRevokeOwnership = (p: Player): boolean => {
        if (obj.getOwningPlayerSlot() === p.getSlot()) {
            obj.setOwningPlayerSlot(-1);
            obj.setPrimaryColor(WHITE);
            return true;
        } else {
            p.showMessage("you do not have permission to revoke ownership");
            return false;
        }
    };

    const UI = new UIElement();

    UI.scale = 0.5;
    UI.anchorX = 0.5;
    UI.anchorY = 0.5;

    UI.position = new Vector(0, 0, 3);

    const theButton = new Button();
    const theLabel = new Text();

    const handleOnClickTake = (btn: Button, p: Player) => {
        if (doTakeOwnership(p)) {
            theButton.onClicked.remove(handleOnClickTake);
            theButton.onClicked.add(handleOnClickRevoke);
            theButton.setText("Revoke Ownership");
            const perm = new PlayerPermission();
            theLabel.setText(p.getName());
            theLabel.setTextColor(p.getPlayerColor());
            perm.addPlayer(p);
            UI.players = perm;
            obj.updateUI(UI);
        }
    };

    const handleOnClickRevoke = (btn: Button, p: Player) => {
        if (doRevokeOwnership(p)) {
            theButton.onClicked.add(handleOnClickTake);
            theButton.onClicked.remove(handleOnClickRevoke);
            theButton.setText("Take Ownership");
            const perm = new PlayerPermission();
            UI.players = perm;
            obj.updateUI(UI);
            theLabel.setText("");
            theLabel.setTextColor(p.getPlayerColor());
        }
    };

    if (obj.getOwningPlayerSlot() === -1) {
        theButton.setText("Take Ownership");
        theButton.onClicked.add(handleOnClickTake);
    } else {
        theButton.setText("Revoke Ownership");
        theButton.onClicked.add(handleOnClickRevoke);
    }

    UI.widget = new HorizontalBox().addChild(theButton).addChild(theLabel);

    obj.addUI(UI);
})(refObject);
