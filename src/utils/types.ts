import { ReactText } from 'react';

export interface IFluxAction {
  type: string;
  payload?: Iobj;
  meta?: Iobj;
}
export type Optional<T> = { [P in keyof T]?: T[P] };

export interface IMatriceTypes {
  flareTemp: string;
  waterTemp: string;
  casingPressure: string;
  tubingPressure: string;
  oilTemp: string;
  injValveOpen: string;
}
export type IData = string | number | string[] | number[] | boolean | ReactText | ReactText[];
export interface Iobj {
  [key: string]: IData | Iobj;
}
export interface IobjStr {
  [key: string]: string;
}
export interface IEventTarget extends EventTarget {
  dataset?: IobjStr;
}
export interface IMouseEvent extends MouseEvent {
  currentTarget: IEventTarget;
}