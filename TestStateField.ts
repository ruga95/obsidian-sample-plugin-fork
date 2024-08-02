import { StateEffect, StateField, EditorState, Transaction } from "@codemirror/state";

const addEffect = StateEffect.define<number>();
const subtractEffect = StateEffect.define<number>();
const resetEffect = StateEffect.define();

export const calculatorField = StateField.define<number>({
	create(state: EditorState): number {
		return 0;
	},
	update(oldState: number, transaction: Transaction): number {
		let newState = oldState;
    // console.log(oldState, transaction);
		for (const effect of transaction.effects) {
			if (effect.is(addEffect)) {
				newState += effect.value;
			} else if (effect.is(subtractEffect)) {
				newState -= effect.value;
			} else if (effect.is(resetEffect)) {
				newState = 0;
			}
		}

		return newState;
	},
});
