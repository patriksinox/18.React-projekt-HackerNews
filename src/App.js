import { useReducer, useEffect } from "react";
import reducer from "./reducer";
import { Container, Row, Col, Input, Spinner } from "reactstrap";
import Footer from "./Footer";

const init = {
  nacitanie: false,
  strana: 0,
  pocetStran: 50,
  clanky: [],
  hladanie: "react",
};

function App() {
  const [state, dispatch] = useReducer(reducer, init);

  let url = `https://hn.algolia.com/api/v1/search?query=${state.hladanie}&page=${state.strana}`;

  const fetchDat = async (url) => {
    dispatch({ type: "NACITANIE", nacitanie: true });
    try {
      const resp = await fetch(url);
      const data = await resp.json();

      dispatch({
        type: "NACITANE",
        clanky: data.hits,
        nacitanie: false,
        pocetStran: data.nbPages,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const hladam = (slovo) => {
    dispatch({ type: "HLADANIE", hladanie: slovo, nacitanie: true });
  };

  const pagi = (typ) => {
    if (typ === "NASLEDUJUCA") {
      dispatch({ type: "NASLEDUJUCA" });
    }
    if (typ === "PREDCHADZAJUCA") {
      if (state.strana !== 0) {
        dispatch({ type: "PREDCHADZAJUCA" });
      }
    }
  };

  const vymazClanok = (id) => {
    const noveClanky = state.clanky.filter((clanok) => clanok.objectID !== id);
    dispatch({ type: "VYMAZ_CLANOK", clanky: noveClanky });
  };

  useEffect(() => {
    fetchDat(url);
    // eslint-disable-next-line
  }, [state.strana, state.hladanie]);

  return (
    <>
      <Container>
        <section>
          <h2>Hľadaj na Hacker News</h2>
          <Input
            placeholder={init.hladanie}
            onChange={(e) => hladam(e.target.value)}
          />
        </section>
        <div className="strany">
          <button
            className="btn btn-primary"
            onClick={() => pagi("PREDCHADZAJUCA")}
          >
            Predošlá
          </button>
          <span className="text-primary">
            {state.strana + 1} z {state.pocetStran}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => pagi("NASLEDUJUCA")}
          >
            Nasledujúca
          </button>
        </div>
        <Row md="2" sm="2" xs="1">
          {state.nacitanie ? (
            <Spinner>Loading...</Spinner>
          ) : (
            state.clanky.map((clanok) => {
              const { title, objectID, url, author, num_comments, points } =
                clanok;
              return (
                <Col key={objectID}>
                  <article className="clanok text-center shadow-sm">
                    <div className="obsahclanku">
                      <h5>{title}</h5>
                      <div className="komenty">
                        <p>
                          {points} bodov napísal {author.toUpperCase()} |{" "}
                          {num_comments} komentov.
                        </p>
                        <div className="buttony">
                          <button className="precitaj">
                            <a href={url} target="_blank" rel="noreferrer">
                              Prečítaj
                            </a>
                          </button>
                          <button
                            className="vymaz"
                            onClick={() => vymazClanok(objectID)}
                          >
                            Vymaž Článok
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </Col>
              );
            })
          )}
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default App;
