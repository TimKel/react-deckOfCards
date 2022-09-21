import { useState, useRef, useEffect } from 'react';
import Card from './Card';
import axios from 'axios'

const BASE_URL = 'http://deckofcardsapi.com/api/deck';

const Deck = () => {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    
    const timerRef = useRef(null);

    //Load deck from API into state
    useEffect(() => {
        async function getData() {
            let d = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(d.data);
        }
        getData();
    }, [setDeck]);

    //Draw one card every second if autodraw is true
    useEffect(() => {
        //Draw card via API, add card to state "drawn" list
        async function getCard() {
            let { deck_id } = deck;
        
            try {
                let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/`)

                if (drawRes.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error("No Cards Remaining");
                }

                const card = drawRes.data.cards[0];

                setDrawn(d => [
                    ...d,
                    {
                        id: card.code,
                        name: card.suit + " " + card.value,
                        image: card.image
                    }
                ]);
            } catch(err){
                alert(err);
            }
        }

        if(autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div className="deck">
            {deck ? (
                <button className="Deck-gimme" onClick={toggleAutoDraw}>
                    {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
                </button>
            ) : null}
            <div className="Deck-cardarea">{cards}</div>
        </div>
    );
}

export default Deck;