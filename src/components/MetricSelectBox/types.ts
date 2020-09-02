export interface IState {
    values: string | string[];
    focusedValue: number;
    isFocused: boolean;
    isOpen: boolean;
    typed: string;
  }
  export type IOption = { value: string | number; label: string };
  export type IOptions = IOption[];
  export interface IProps {
    options?: IOptions;
    multiple?: boolean;
    placeholder?: string;
    label?: string | JSX.Element;
    onChange?: (value: string | string[]) => void;
  }