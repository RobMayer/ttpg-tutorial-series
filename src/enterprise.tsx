import { GameObject, Rotator, TextJustification, UIElement, UIPresentationStyle, UIZoomVisibility, Vector, refObject } from "@tabletop-playground/api";
import { canvasChild, jsxInTTPG, render } from "jsx-in-ttpg";

((obj: GameObject) => {
    const CardUI = new UIElement();

    CardUI.scale = 0.25;
    CardUI.anchorX = 0;
    CardUI.anchorY = 0.5;
    CardUI.presentationStyle = UIPresentationStyle.ViewAligned;
    CardUI.zoomVisibility = UIZoomVisibility.ZoomedOnly;
    CardUI.useWidgetSize = false;
    CardUI.width = 200 + 354;
    CardUI.height = 512;

    CardUI.widget = render(<canvas>{canvasChild({ x: 200, y: 0, width: 354, height: 512 }, <image src="ui/enterprise.jpg" height={512} />)}</canvas>);

    const HUDUi = new UIElement();
    HUDUi.scale = 0.25;
    HUDUi.anchorX = 0;
    HUDUi.anchorY = 1;
    HUDUi.presentationStyle = UIPresentationStyle.ViewAligned;
    HUDUi.zoomVisibility = UIZoomVisibility.ZoomedOnly;
    HUDUi.useWidgetSize = false;
    HUDUi.width = 256;
    HUDUi.height = 256;

    HUDUi.position = new Vector(1.5, 0, 2.625);

    HUDUi.widget = render(
        <canvas>
            {canvasChild({ x: 0, y: 256 - 64, width: 256, height: 64 }, <image src="ui/pointer.png" color={"#fc3"} />)}
            {canvasChild({ x: 64, y: 256 - 64 - 24, width: 192, height: 24 }, <text justify={TextJustification.Center}>Bridge</text>)}
        </canvas>
    );

    obj.addUI(HUDUi);
    obj.addUI(CardUI);
})(refObject);
