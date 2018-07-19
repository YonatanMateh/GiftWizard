import { h, app } from "hyperapp"

const PLUS = '+', MINUS = '-', EQUALS = '=', MULTIPLE = '*';
const state = {
  formula: ""
}

const actions = {
  operator: value => addOpretor(value),
  delete: value => deleteChar(),
  number: value => addNumber(value),
  calculate: value => calculateResult(),
  clear: value => clearFormula()
}

// deliting the last char (number or operator)
const deleteChar = () => {
  state.formula = state.formula.slice(0, -1);
  return state;
}

// adding number to the formula
const addNumber = (val) => {
  updateFormulaIfHasResult();
  state.formula += val;
  return state;
}

// updating the formula state and checking if there is a result,
// starting a new formula agian
const updateFormulaIfHasResult = () => {
  let formula = state.formula.split(' = ');
  let result = formula[1];
  if (result === '') {
    state.formula = formula[0]; // the formula for a new calculation
  } else if (result) {
    result === '0' ? state.formula = "" : state.formula = result;
  }
}

// adding operator to the formula
const addOpretor = (val) => {
  updateFormulaIfHasResult();
  const lastChar = state.formula[state.formula.length - 1];
  if (isOperator(lastChar)) {
    state.formula = state.formula.slice(0, -1); // removing the previous operator
  }
  state.formula += val; // adding the new operator
  return state;
}

const isOperator = (arg) => {
  return arg === PLUS || arg === MINUS || arg === EQUALS || arg === MULTIPLE;
}

// sperates the string into array of numbers and operators
const convertStringToFormulaArr = () => {
  const lastChar = state.formula[state.formula.length - 1];
  if (isOperator(lastChar)) {
    state.formula = state.formula.slice(0, -1);
  }
  return state.formula.split(/(-|\+|\*)/g).filter(x => x !== '');
}

const calculateResult = () => {
  updateFormulaIfHasResult();
  if (state.formula && !/^-?(\d+)$/.test(state.formula)) {
    const formulaArr = convertStringToFormulaArr();
    // first init to 0 and + for the first number (0+x=x)
    let result = 0;
    let operator = '+';
    let temp = 0;
    for (let i = 0; i < formulaArr.length; i++) {
      if (isOperator(formulaArr[i])) { //operator
        operator = formulaArr[i];
      } else { //number
        temp = parseFloat(formulaArr[i]);
        switch (operator) {
          case PLUS:
            result += temp;
            break;
          case MINUS:
            result -= temp;
            break;
          case MULTIPLE:
            result *= temp;
            break;
        }
      }
    }
    state.formula += ' = ' + result;
  }
  return state;
}

const clearFormula = () => {
  state.formula = '';
  return state;
}

const view = (state, actions) => (
  <div class="container">
    <h3>{state.formula || '0'}</h3>
    <div class="operators">
      <button class="btn btn-operator" onclick={() => actions.operator('+')} >+</button>
      <button class="btn btn-operator" onclick={() => actions.operator('-')}>-</button>
      <button class="btn btn-operator" onclick={() => actions.calculate()}>=</button>
      <button class="btn btn-operator" onclick={() => actions.delete()}>-></button>
    </div>
    <div class="inner">
      <div class="numbers-container">
        <button class="btn btn-number" onclick={() => actions.number(1)}>1</button>
        <button class="btn btn-number" onclick={() => actions.number(2)}>2</button>
        {/* <button class="btn btn-number" onclick={() => actions.number(3)}>3</button>
        <button class="btn btn-number" onclick={() => actions.number(4)}>4</button>
        <button class="btn btn-number" onclick={() => actions.number(5)}>5</button>
        <button class="btn btn-number" onclick={() => actions.number(6)}>6</button>
        <button class="btn btn-number" onclick={() => actions.number(7)}>7</button>
        <button class="btn btn-number" onclick={() => actions.number(8)}>8</button>
        <button class="btn btn-number" onclick={() => actions.number(9)}>9</button> */}
      </div>
      <div class="side-operators">
        {/* <button class="btn btn-operator" onclick={() => actions.operator('*')}>*</button> */}
        <button class="btn  btn-operator" onclick={() => actions.clear('C')} >C</button>
      </div>
    </div>

  </div>
)

app(state, actions, view, document.body)