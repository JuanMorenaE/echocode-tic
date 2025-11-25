import { Ingrediente } from "./ingrediente.types"

export interface Category {
    id: number,
    name: string,
    type: "BURGER" | "PIZZA",
    ingredients: Ingrediente[],
    selected_ingredients: number[],
    multiple_select: boolean,
    required: boolean,
    order: number,
}