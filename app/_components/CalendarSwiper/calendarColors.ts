declare enum AppName {
    /** Mail sending module */
    SEND = "send",
    /** Property/title search module */
    SEARCH = "search",
    /** Document storage module */
    STORE = "store",
    /** Skip tracing/re-mail module */
    SCOUT = "scout",
    /** E-signature module */
    SIGN = "sign",
    /** File organization module */
    SORT = "sort",
    /** Admin/power user module */
    SAGE = "sage",
    /** Main platform */
    SYMPLE = "symple",
    /** Account management */
    ACCOUNT = "account",
    /** Integration/sync module */
    SYNC = "sync"
}

type BorderColorsType = {
  [AppName.SEARCH]: string[]
  [AppName.SCOUT]: string[]
  [AppName.SIGN]: string[]
  [AppName.SEND]: string[]
  [AppName.STORE]: string[]
  default: string[]
}

// export const borderColors: BorderColorsType = {
//   // [AppName.SEARCH]: ['#FF6F00', '#FFB780', '#FFC599', '#FFD4B2', '#FFE2CC'],
//   // [AppName.SCOUT]: ['#34C759', '#99E3AC', '#AEE9BD', '#C2EECD', '#D6F4DE'],
//   // [AppName.SIGN]: ['#FFCC02', '#FFE580', '#FFEB9A', '#FFF0B3', '#FFF5CC'],
//   [AppName.SEND]: ['#0F5CCF', '#87ADE7', '#9FBEEC', '#B7CEF1', '#CFDEF5'],
//   // [AppName.STORE]: ['#0F5CCF', '#87ADE7', '#9FBEEC', '#B7CEF1', '#CFDEF5'],
//   default: ['#000000', '#8E8E93', '#A1A1A5', '#B4B4B7', '#C7C7C9', '#DADADA']
// }