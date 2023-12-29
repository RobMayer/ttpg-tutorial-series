import { Button, Color, GameObject, ImageWidget, Player, PlayerPermission, Rotator, UIElement, UIZoomVisibility, Vector, WidgetSwitcher, refObject, world } from "@tabletop-playground/api";
import { jsxInTTPG, render, useRef } from "jsx-in-ttpg";
import { Storage, CrossRef } from "ttpg-common-lib";
import { DialOptions } from "./types";

const WHITE = new Color(1, 1, 1, 1);

const Commands = {
    firepower: {
        texture: "ui/firepower.png",
        index: 0,
    },
    navigate: {
        texture: "ui/navigation.png",
        index: 1,
    },
    engineering: {
        texture: "ui/engineering.png",
        index: 2,
    },
    fighters: {
        texture: "ui/fighter.png",
        index: 3,
    },
} as const;

type Command = keyof typeof Commands;
const CommandIdx: Command[] = ["firepower", "navigate", "engineering", "fighters"];

type DialStore = {
    state: Command;
};

((obj: GameObject) => {
    const persistence = Storage.get<DialStore>(obj, "@ThatRobHuman/commandDial");
    let { state } = persistence.load() ?? { state: "firepower" };

    const publicSwitchRef = useRef<WidgetSwitcher>();
    const privateSwitchRef = useRef<WidgetSwitcher>();

    const rotateLeft = (o: Button, p: Player) => {
        const idx = Commands[state].index;
        const newIndex = idx === 0 ? 3 : (idx - 1) % 4;
        state = CommandIdx[newIndex];
        publicSwitchRef.current?.setActiveIndex(newIndex);
        privateSwitchRef.current?.setActiveIndex(newIndex);
        persistence.save({ state });
        world.broadcastChatMessage(`${p.getName()} changed command dial (${obj.getId()})`);
        world.showPing(obj.getPosition(), p.getPlayerColor(), true);
    };

    const rotateRight = (o: Button, p: Player) => {
        const idx = Commands[state].index;
        const newIndex = (idx + 1) % 4;
        state = CommandIdx[newIndex];
        publicSwitchRef.current?.setActiveIndex(newIndex);
        privateSwitchRef.current?.setActiveIndex(newIndex);
        persistence.save({ state });
        world.broadcastChatMessage(`${p.getName()} changed command dial (${obj.getId()})`);
        world.showPing(obj.getPosition(), p.getPlayerColor(), true);
    };

    const publicUI = new UIElement();
    publicUI.anchorX = 0.5;
    publicUI.anchorY = 0.5;
    publicUI.scale = 0.5;
    publicUI.position = new Vector(0, 0, -0.01);
    publicUI.rotation = new Rotator(180, 0, 0);
    publicUI.zoomVisibility = UIZoomVisibility.Both;

    publicUI.widget = render(
        <horizontalbox>
            <switch ref={publicSwitchRef} value={Commands[state].index}>
                <image src={Commands.firepower.texture} width={32} height={32} />
                <image src={Commands.navigate.texture} width={32} height={32} />
                <image src={Commands.engineering.texture} width={32} height={32} />
                <image src={Commands.fighters.texture} width={32} height={32} />
            </switch>
        </horizontalbox>
    );

    const privateUI = new UIElement();
    privateUI.anchorX = 0.5;
    privateUI.anchorY = 0.5;
    privateUI.scale = 0.5;
    privateUI.position = new Vector(0, 0, 0.375);
    privateUI.zoomVisibility = UIZoomVisibility.Both;

    const setDialPermissions = (slot: number) => {
        obj.setOwningPlayerSlot(slot);
        privateUI.players = new PlayerPermission().setPlayerSlots([slot]);
        privateSwitchRef.current?.getAllChildren().forEach((child) => {
            const img = child as ImageWidget;
            img.setTintColor(world.getSlotColor(slot));
        });
        obj.updateUI(privateUI);
    };

    const unregister = CrossRef.register<DialOptions>("@ThatRobHuman/dialOptions", obj.getId(), {
        setDialPermissions,
    });

    obj.onDestroyed.add(() => {
        unregister();
    });

    setDialPermissions(obj.getOwningPlayerSlot());

    privateUI.widget = render(
        <horizontalbox>
            <button onClick={rotateLeft}>{"<"}</button>
            <switch ref={privateSwitchRef} value={Commands[state].index}>
                <image color={world.getSlotColor(obj.getOwningPlayerSlot()) ?? WHITE} src={Commands.firepower.texture} width={32} height={32} />
                <image color={world.getSlotColor(obj.getOwningPlayerSlot()) ?? WHITE} src={Commands.navigate.texture} width={32} height={32} />
                <image color={world.getSlotColor(obj.getOwningPlayerSlot()) ?? WHITE} src={Commands.engineering.texture} width={32} height={32} />
                <image color={world.getSlotColor(obj.getOwningPlayerSlot()) ?? WHITE} src={Commands.fighters.texture} width={32} height={32} />
            </switch>
            <button onClick={rotateRight}>{">"}</button>
        </horizontalbox>
    );

    obj.addUI(publicUI);
    obj.addUI(privateUI);
})(refObject);
