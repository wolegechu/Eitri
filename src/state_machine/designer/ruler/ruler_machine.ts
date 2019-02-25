import {fabric} from 'fabric';

import {ChangeToSelectionMode} from '../../..';
import {GLOBAL_SCALE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {GetImage} from '../../../image_manager';
import {Background} from '../../../view/canvas_components/background';
import {CanvasManager} from '../../../view/canvas_components/canvas_manager';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {StateMachine} from '../../state_machine';

export class RulerMachine extends StateMachine {
  private rulerLeft: fabric.Image;
  private rulerRight: fabric.Image;
  private rulerLengthText: fabric.Text;

  private rulerLength = 100;
  private inputLengthCache = 0;

  protected transisionTable: [];

  private funcOnPressESC = (e: EventSystem.FssEvent) => {
    this.OnPressESC(e);
  };
  private funcOnEnterPress = (e: EventSystem.FssEvent) => {
    this.OnEnterPress(e);
  };
  private funcOnNumberPress = (e: EventSystem.FssEvent) => {
    this.OnNumberPress(e);
  };
  private funcOnBackPress = (e: EventSystem.FssEvent) => {
    this.OnBackPress(e);
  };

  constructor() {
    super();
    console.debug('Enter Ruler Mode');
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_NUMBER, this.funcOnNumberPress);
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_BACKSPACE, this.funcOnBackPress);
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ENTER, this.funcOnEnterPress);

    const rulerImage = GetImage('ruler');
    this.rulerLeft = new fabric.Image(rulerImage, {
      originY: 'center',
      left: CanvasManager.width / 2,
      top: CanvasManager.height / 2,
      scaleX: 0.5,
      scaleY: 0.5,
      hasBorders: false,
      hasControls: false
    });

    this.rulerRight = new fabric.Image(rulerImage, {
      originX: 'right',
      originY: 'center',
      left: CanvasManager.width / 2 + this.rulerLength,
      top: CanvasManager.height / 2,
      scaleX: 0.5,
      scaleY: 0.5,
      flipX: true,
      hasBorders: false,
      hasControls: false
    });

    this.rulerLengthText = new fabric.Text('1000', {
      originX: 'center',
      originY: 'center',
      left: CanvasManager.width / 2 + this.rulerLength / 2,
      top: CanvasManager.height / 2,
      evented: false,
      fontSize: 15
    });

    const TOP_RENDER = 10000;
    CanvasManager.Add(this.rulerLeft, TOP_RENDER);
    CanvasManager.Add(this.rulerRight, TOP_RENDER);
    CanvasManager.Add(this.rulerLengthText, TOP_RENDER);

    CanvasManager.OnObjectMove((e) => this.OnRulerLeftMove(e));

    CanvasManager.OnObjectMove((e) => this.OnRulerRightMove(e));
  }

  Exit(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_NUMBER, this.funcOnNumberPress);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_BACKSPACE, this.funcOnBackPress);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ENTER, this.funcOnEnterPress);

    CanvasManager.Remove(this.rulerLeft);
    CanvasManager.Remove(this.rulerRight);
    CanvasManager.Remove(this.rulerLengthText);
  }

  private OnRulerRightMove(e: fabric.IEvent) {
    if (e.target !== this.rulerRight) return;

    this.rulerLength = this.rulerRight.left - this.rulerLeft.left;
    this.rulerRight.set({top: this.rulerLeft.top});
    this.rulerRight.setCoords();

    this.rulerLengthText.set({
      left: this.rulerLeft.left + this.rulerLength / 2,
      top: this.rulerLeft.top
    });
    this.rulerLengthText.setCoords();
    CanvasManager.Render();
  }

  private OnRulerLeftMove(e: fabric.IEvent) {
    if (e.target !== this.rulerLeft) return;

    this.rulerRight.set({
      left: this.rulerLeft.left + this.rulerLength,
      top: this.rulerLeft.top
    });
    this.rulerRight.setCoords();

    this.rulerLengthText.set({
      left: this.rulerLeft.left + this.rulerLength / 2,
      top: this.rulerLeft.top
    });
    this.rulerLengthText.setCoords();

    CanvasManager.Render();
  }

  private OnNumberPress(event: EventSystem.FssEvent): void {
    console.log(event);
    let num = this.inputLengthCache;
    num = num * 10 + event.digitNumber;
    this.inputLengthCache = num;
    this.rulerLengthText.text = num.toString();
    CanvasManager.Render();
  }

  private OnBackPress(event: EventSystem.FssEvent): void {
    let num = this.inputLengthCache;
    num = Math.floor(num / 10);
    this.inputLengthCache = num;
    this.rulerLengthText.text = num.toString();
    CanvasManager.Render();
  }

  private OnEnterPress(e: EventSystem.FssEvent) {
    const backgrouds =
        ViewFactory.GetViewObjectsWithType<Background>(Background);
    if (!backgrouds || backgrouds.length === 0) return;
    const backgroud = backgrouds[0];

    const newScale = this.inputLengthCache / GLOBAL_SCALE * backgroud.scale /
        this.rulerLength;
    backgroud.SetScale(newScale);

    ChangeToSelectionMode();
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    ChangeToSelectionMode();
  }
}