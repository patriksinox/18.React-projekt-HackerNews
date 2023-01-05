const reducer = (state, action) => {
  switch (action.type) {
    case "NACITANIE":
      return { ...state, nacitanie: action.nacitanie };
    case "NACITANE":
      return {
        ...state,
        clanky: action.clanky,
        nacitanie: action.nacitanie,
        pocetStran: action.pocetStran,
      };
    case "HLADANIE":
      return {
        ...state,
        strana: 0,
        hladanie: action.hladanie,
      };
    case "NASLEDUJUCA":
      return {
        ...state,
        strana: state.strana + 1,
      };
    case "PREDCHADZAJUCA":
      return {
        ...state,
        strana: state.strana - 1,
      };
    case "VYMAZ_CLANOK":
      return {
        ...state,
        clanky: action.clanky,
      };
    default:
      return state;
  }
};

export default reducer;
