'use client'
import { createContext, useContext } from 'react'
export type Dict = Record<string,string>
export const I18nContext = createContext<{locale:string, t:(k:string, v?:Record<string,string|number>)=>string}>({
  locale:'es', t:(k)=>k
})
export function useI18n(){ return useContext(I18nContext) }
