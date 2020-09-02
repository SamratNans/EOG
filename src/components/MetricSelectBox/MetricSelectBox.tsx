import React, { useReducer } from 'react';
import { IFluxAction, IMouseEvent, Optional } from '../../utils';
import { IState, IProps, IOption } from './types';
import './style.css';

function stateReducer(state: IState, action: IFluxAction) {
  const { payload, type: actionType } = action;
  const newState: IState = { ...state, ...payload };
  const updatedState: Optional<IState> = {};
  switch (actionType) {
    default:
      break;
  }
  return {
    ...newState,
    ...updatedState,
  };
}

let timeout: number | undefined;
const MetricSelectBox = (props: IProps) => {
  const { options = [], multiple = false, placeholder = '', label = '', onChange } = props;
  const [state, dispatch] = useReducer(stateReducer, {
    values: [],
    focusedValue: -1,
    isFocused: false,
    isOpen: false,
    typed: '',
  });
  const onFocus = () => {
    dispatch({ type: 'isFocused', payload: { isFocused: true } });
  };
  const triggerValue = (values: string | string[]) => {
    onChange && onChange(values);
    return values;
  };

  const onBlur = () => {
    const { values } = state;

    if (multiple) {
      dispatch({
        type: 'isFocused',
        payload: {
          focusedValue: -1,
          isFocused: false,
          isOpen: false,
        },
      });
    } else {
      const value = values[0];

      let focusedValue = -1;

      if (value) {
        focusedValue = options && options.findIndex(option => option.value === value);
      }
      dispatch({
        type: 'isFocused',
        payload: {
          focusedValue,
          isFocused: false,
          isOpen: false,
        },
      });
    }
  };

  const onKeyDown = (e: { key: string; preventDefault: () => void }) => {
    let { isOpen, focusedValue } = state;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (multiple && focusedValue !== -1) {
            const values = state.values as string[];
            const value = options[focusedValue].value;
            const index = values.indexOf(`${value}`);

            if (index === -1) {
              values.push(`${value}`);
            } else {
              values.splice(index, 1);
            }

            dispatch({
              type: 'value',
              payload: {
                values: triggerValue(values),
              },
            });
          }
        } else {
          dispatch({ type: 'isOpen', payload: { isOpen: true } });
        }
        break;
      case 'Escape':
      case 'Tab':
        if (isOpen) {
          e.preventDefault();
          dispatch({ type: 'isOpen', payload: { isOpen: false } });
        }
        break;
      case 'Enter':
        dispatch({ type: 'isOpen', payload: { isOpen: !state.isOpen } });
        break;
      case 'ArrowDown':
        e.preventDefault();

        if (focusedValue < options.length - 1) {
          focusedValue++;

          if (multiple) {
            dispatch({ type: 'focusedValue', payload: { focusedValue } });
          } else {
            let values = [`${options[focusedValue].value}`];
            dispatch({
              type: 'focusedValue',
              payload: {
                values: triggerValue(values),
                focusedValue,
              },
            });
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (focusedValue > 0) {
          focusedValue--;

          if (multiple) {
            dispatch({
              type: 'focusedValue',
              payload: {
                focusedValue,
              },
            });
          } else {
            let values = [`${options[focusedValue].value}`];
            dispatch({
              type: 'focusedValue',
              payload: {
                values: triggerValue(values),
                focusedValue,
              },
            });
          }
        }
        break;
      default:
        if (/^[a-z0-9]$/i.test(e.key)) {
          const char = e.key;

          clearTimeout(timeout);
          timeout = setTimeout(() => {
            dispatch({
              type: 'typed',
              payload: {
                typed: '',
              },
            });
          }, 1000);

          const typed = state.typed + char;
          const re = new RegExp(`^${typed}`, 'i');
          const index = options.findIndex(option => re.test(`${option.value}`));

          if (index === -1) {
            dispatch({
              type: 'typed',
              payload: {
                typed,
              },
            });
          }

          if (multiple) {
            dispatch({
              type: 'typed',
              payload: {
                focusedValue: index,
                typed,
              },
            });
          } else {
            let values = [`${options[index].value}`];
            dispatch({
              type: 'typed',
              payload: {
                values: triggerValue(values),
                focusedValue: index,
                typed,
              },
            });
          }
        }
        break;
    }
  };

  const onClick = () => {
    dispatch({
      type: 'isOpen',
      payload: {
        isOpen: !state.isOpen,
      },
    });
  };

  const onDeleteOption = (ev: React.MouseEvent) => {
    const e = (ev as unknown) as IMouseEvent;
    if (!e || !e.currentTarget || !e.currentTarget.dataset) return;
    const { value } = e.currentTarget.dataset;
    if (multiple) {
      const values = state.values as string[];
      const index = values.indexOf(value);

      values.splice(index, 1);
      dispatch({
        type: 'values',
        payload: {
          values: triggerValue(values),
        },
      });
    }
  };

  const onHoverOption = (ev: React.MouseEvent) => {
    const e = (ev as unknown) as IMouseEvent;
    if (!e || !e.currentTarget || !e.currentTarget.dataset) return;
    const { value } = e.currentTarget.dataset;
    const index = options.findIndex(option => option.value === value);
    dispatch({
      type: 'focusedValue',
      payload: {
        focusedValue: index,
      },
    });
  };

  const onClickOption = (ev: React.MouseEvent) => {
    const e = (ev as unknown) as IMouseEvent;
    if (!e || !e.currentTarget || !e.currentTarget.dataset) return;
    const { value } = e.currentTarget.dataset;
    if (multiple) {
      const values = state.values as string[];
      const index = values.indexOf(value);

      if (index === -1) {
        values.push(value);
      } else {
        values.splice(index, 1);
      }
      dispatch({
        type: 'values',
        payload: {
          values: triggerValue(values),
        },
      });
    } else {
      dispatch({
        type: 'isOpen',
        payload: {
          values: triggerValue(value),
          isOpen: false,
        },
      });
      onChange && onChange(value);
    }
  };

  const stopPropagation = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  const renderValues = () => {
    const { values } = state;

    if (values.length === 0) {
      return <div className="placeholder">{placeholder}</div>;
    }

    if (multiple) {
      return (values as string[]).map(value => {
        return (
          <span key={value} onClick={stopPropagation} className="multiple value">
            {value}
            <span data-value={value} onClick={onDeleteOption} className="delete">
              X
            </span>
          </span>
        );
      });
    }

    return <div className="value">{values[0]}</div>;
  };

  const renderOptions = () => {
    const { isOpen } = state;

    if (!isOpen) {
      return null;
    }

    return <div className="options">{options.map(renderOption)}</div>;
  };

  const renderOption = (option: IOption, index: number) => {
    const { values, focusedValue } = state;

    const { value, label: valueLabel } = option;

    const selected = values.includes(`${value}`);

    let className = 'option';
    if (selected) className += ' selected';
    if (index === focusedValue) className += ' focused';

    return (
      <div key={value} data-value={value} className={className} onMouseOver={onHoverOption} onClick={onClickOption}>
        {valueLabel || value}
      </div>
    );
  };

  const { isOpen } = state;

  return (
    <div className="metric-select-box" tabIndex={0} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
      <label className="label">{label}</label>
      <div className="selection" onClick={onClick}>
        {renderValues()}
      </div>
      {renderOptions()}
    </div>
  );
};


export default MetricSelectBox;