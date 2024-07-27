import '../style/game.css';
const Square = ({ value, onClick }) => {
    return (
        <div className="square" onClick={onClick}>
            {value}
        </div>
    );
};

export default Square;