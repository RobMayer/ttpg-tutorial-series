import { Color, GameObject, Player, refObject } from "@tabletop-playground/api";

const WHITE = new Color(1, 1, 1, 1);

((obj: GameObject) => {
    if (obj.getOwningPlayerSlot() !== -1) {
        obj.addCustomAction("» Revoke Ownership «", "Make this object no-ones", "revokeOwnership");
    } else {
        obj.addCustomAction("» Take Ownership «", "Make this object mine", "takeOwnership");
    }

    const doTakeOwnership = (p: Player) => {
        obj.setOwningPlayerSlot(p.getSlot());
        obj.setPrimaryColor(p.getPlayerColor());
        obj.addCustomAction("» Revoke Ownership «", "Make this object no-ones", "revokeOwnership");
        obj.removeCustomAction("takeOwnership");
    };

    const doRevokeOwnership = (p: Player) => {
        if (obj.getOwningPlayerSlot() === p.getSlot()) {
            obj.setOwningPlayerSlot(-1);
            obj.setPrimaryColor(WHITE);
            obj.addCustomAction("» Take Ownership «", "Make this object mine", "takeOwnership");
            obj.removeCustomAction("revokeOwnership");
        } else {
            p.showMessage("you do not have permission to revoke ownership");
        }
    };

    obj.onCustomAction.add((o, p, id) => {
        switch (id) {
            case "takeOwnership":
                return doTakeOwnership(p);
            case "revokeOwnership":
                return doRevokeOwnership(p);
        }
    });

    obj.onGrab.add((o, p) => {
        if (obj.getOwningPlayerSlot() === -1) {
            doTakeOwnership(p);
        }
    });

    obj.onReleased.add((o, p) => {
        if (obj.getOwningPlayerSlot() === p.getSlot()) {
            doRevokeOwnership(p);
        }
    });
})(refObject);
