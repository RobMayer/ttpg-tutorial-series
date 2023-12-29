import { Color, Container, Player, refContainer } from "@tabletop-playground/api";

const WHITE = new Color(1, 1, 1, 1);

((crate: Container) => {
    crate.onRemoved.add((thisObj, pulledObj, player) => {
        (pulledObj as any)?.setDialPermissions(player.getSlot());
    });
})(refContainer);
