// FILE: src/context/AppContext.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const AppContext = createContext(null);

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
  user: JSON.parse(localStorage.getItem("user")) || null,
  toasts: [],
  searchQuery: "",
  filters: { category: "all", minPrice: 0, maxPrice: Infinity, sort: "default" },
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    // CART
    case "CART_ADD": {
      const exists = state.cart.find((i) => i.id === action.item.id);
      const cart = exists
        ? state.cart.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...state.cart, { ...action.item, qty: 1 }];
      return { ...state, cart };
    }
    case "CART_REMOVE":
      return { ...state, cart: state.cart.filter((i) => i.id !== action.id) };
    case "CART_UPDATE_QTY": {
      const cart =
        action.qty <= 0
          ? state.cart.filter((i) => i.id !== action.id)
          : state.cart.map((i) =>
              i.id === action.id ? { ...i, qty: action.qty } : i
            );
      return { ...state, cart };
    }
    case "CART_CLEAR":
      return { ...state, cart: [] };

    // WISHLIST
    case "WISHLIST_TOGGLE": {
      const inList = state.wishlist.find((i) => i.id === action.item.id);
      const wishlist = inList
        ? state.wishlist.filter((i) => i.id !== action.item.id)
        : [...state.wishlist, action.item];
      return { ...state, wishlist };
    }

    // AUTH
    case "AUTH_LOGIN":
      return { ...state, user: action.user };
    case "AUTH_LOGOUT":
      return { ...state, user: null };

    // TOAST
    case "TOAST_ADD":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "TOAST_REMOVE":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    // SEARCH / FILTER
    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.filter } };

    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    else localStorage.removeItem("user");
  }, [state.user]);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    dispatch({ type: "TOAST_ADD", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "TOAST_REMOVE", id }), 3500);
  }, []);

  // ── Cart helpers ────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (item) => {
      dispatch({ type: "CART_ADD", item });
      toast(`${item.title} added to cart 🛒`);
    },
    [toast]
  );

  const removeFromCart = useCallback((id) => dispatch({ type: "CART_REMOVE", id }), []);
  const updateQty = useCallback(
    (id, qty) => dispatch({ type: "CART_UPDATE_QTY", id, qty }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CART_CLEAR" }), []);

  // ── Wishlist helpers ─────────────────────────────────────────────────────────
  const toggleWishlist = useCallback(
    (item) => {
      const inList = state.wishlist.find((i) => i.id === item.id);
      dispatch({ type: "WISHLIST_TOGGLE", item });
      toast(inList ? "Removed from wishlist" : "Added to wishlist ❤️", inList ? "info" : "success");
    },
    [state.wishlist, toast]
  );

  const isWishlisted = useCallback(
    (id) => state.wishlist.some((i) => i.id === id),
    [state.wishlist]
  );

  // ── Auth helpers ─────────────────────────────────────────────────────────────
  const login = useCallback(
    (user) => {
      dispatch({ type: "AUTH_LOGIN", user });
      toast(`Welcome back, ${user.name}! 👋`);
    },
    [toast]
  );

  const logout = useCallback(() => {
    dispatch({ type: "AUTH_LOGOUT" });
    toast("Logged out successfully", "info");
  }, [toast]);

  // ── Derived values ────────────────────────────────────────────────────────────
  const cartTotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);

  const value = {
    ...state,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    login,
    logout,
    toast,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};