import { create } from 'zustand'

export enum OrderBy {
	Age = 'age',
	Changes = 'changes',
}

interface OrderByFilterContextType {
	filter: OrderBy
	setFilter: (filter: OrderBy) => void
}

const useOrderByFilter = create<OrderByFilterContextType>((set) => ({
	filter: OrderBy.Age,
	setFilter: (filter: OrderBy) => set({ filter }),
}))

export default useOrderByFilter
