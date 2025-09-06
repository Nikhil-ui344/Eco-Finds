import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

const initialState = { items: [], totalItems: 0 };

function cartReducer(state, action) {
	switch (action.type) {
		case "ADD": {
			const exists = state.items.find((i) => i.id === action.payload.id);
			if (exists) return state; // prevent duplicates
			const items = [...state.items, action.payload];
			return { items, totalItems: items.length };
		}
		case "REMOVE": {
			const items = state.items.filter((i) => i.id !== action.payload);
			return { items, totalItems: items.length };
		}
		case "CLEAR": {
			return { items: [], totalItems: 0 };
		}
		default:
			return state;
	}
}

export function CartProvider({ children }) {
	const [state, dispatch] = useReducer(cartReducer, initialState);
	const addToCart = (item) => dispatch({ type: "ADD", payload: item });
	const removeFromCart = (id) => dispatch({ type: "REMOVE", payload: id });
	const clearCart = () => dispatch({ type: "CLEAR" });
	const getTotalPrice = () => state.items.reduce((s, i) => s + (i.price || 0), 0);

	const value = { ...state, addToCart, removeFromCart, clearCart, getTotalPrice };
	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
