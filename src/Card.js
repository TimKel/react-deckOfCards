

const Card = (props) => {

    console.log("ALT", props.name)
    return (
            <div>
                <img className="Card"
                alt={props.name}
                src={props.image}
                />
            </div>
    )
}

export default Card;