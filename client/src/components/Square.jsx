import '../style/Game.css';
const Square = ({ value, onClick }) => {
    return (
        <div className={`${value == 'x' ? 'square x-sign' : 'square o-sign'}`} onClick={onClick}>
            {value}
        </div>
    );
};

export default Square;