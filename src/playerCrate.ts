import { Color, Container, Player, refContainer } from "@tabletop-playground/api";
import { CrossRef } from "ttpg-common-lib";
import { DialOptions } from "./types";

const WHITE = new Color(1, 1, 1, 1);

((crate: Container) => {
    crate.onRemoved.add((thisObj, pulledObj, player) => {
        const handle = CrossRef.get<DialOptions>("@ThatRobHuman/dialOptions", pulledObj.getId());
        if (handle) {
            handle.setDialPermissions(player.getSlot());
        }
    });
})(refContainer);
